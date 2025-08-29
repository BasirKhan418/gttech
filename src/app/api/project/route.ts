import { NextResponse, NextRequest } from "next/server";
import { getProjects, addProject, updateProject, deleteProject } from "../../../../repository/db/project";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { finduser } from "../../../../repository/db/auth";

// Product Categories
const PRODUCT_CATEGORIES = [
  'Software products',
  'saap',
  'electric vehicles',
  'furnitures',
  'garments'
];

// Validation schema for different categories
const validateProjectData = (data: any) => {
  const errors: string[] = [];

  // Common required fields
  if (!data.title?.trim()) errors.push('Title is required');
  if (!data.description?.trim()) errors.push('Description is required');
  if (!data.category) errors.push('Category is required');
  if (!PRODUCT_CATEGORIES.includes(data.category)) {
    errors.push('Invalid category selected');
  }

  // Category-specific validation
  switch (data.category) {
    case 'Software products':
      // Optional fields for software products
      if (data.portfolios && !Array.isArray(data.portfolios)) {
        errors.push('Portfolios must be an array');
      }
      if (data.industries && !Array.isArray(data.industries)) {
        errors.push('Industries must be an array');
      }
      if (data.capabilities && !Array.isArray(data.capabilities)) {
        errors.push('Capabilities must be an array');
      }
      if (data.valuePropositions && !Array.isArray(data.valuePropositions)) {
        errors.push('Value propositions must be an array');
      }
      break;

    case 'saap':
      if (data.integrations && !Array.isArray(data.integrations)) {
        errors.push('Integrations must be an array');
      }
      if (data.apiSupport && typeof data.apiSupport !== 'boolean') {
        errors.push('API Support must be a boolean');
      }
      break;

    case 'electric vehicles':
      // Validate EV specific fields
      if (data.batteryCapacity && typeof data.batteryCapacity !== 'string') {
        errors.push('Battery capacity must be a string');
      }
      if (data.range && typeof data.range !== 'string') {
        errors.push('Range must be a string');
      }
      break;

    case 'furnitures':
      if (data.material && !Array.isArray(data.material)) {
        errors.push('Material must be an array');
      }
      if (data.assemblyRequired && typeof data.assemblyRequired !== 'boolean') {
        errors.push('Assembly required must be a boolean');
      }
      break;

    case 'garments':
      if (data.sizes && !Array.isArray(data.sizes)) {
        errors.push('Sizes must be an array');
      }
      if (data.colors && !Array.isArray(data.colors)) {
        errors.push('Colors must be an array');
      }
      if (data.fabric && !Array.isArray(data.fabric)) {
        errors.push('Fabric must be an array');
      }
      if (data.careInstructions && !Array.isArray(data.careInstructions)) {
        errors.push('Care instructions must be an array');
      }
      break;
  }

  return errors;
};

// Clean project data based on category
const cleanProjectData = (data: any) => {
  const baseData = {
    title: data.title?.trim(),
    description: data.description?.trim(),
    category: data.category,
    poster: data.poster || '',
    images: Array.isArray(data.images) ? data.images : [],
    icon: data.icon || '',
    technologies: Array.isArray(data.technologies) ? data.technologies : [],
    features: Array.isArray(data.features) ? data.features : [],
    isActive: Boolean(data.isActive),
    isFeatured: Boolean(data.isFeatured)
  };

  // Add category-specific fields
  switch (data.category) {
    case 'Software products':
      return {
        ...baseData,
        portfolios: Array.isArray(data.portfolios) ? data.portfolios : [],
        industries: Array.isArray(data.industries) ? data.industries : [],
        capabilities: Array.isArray(data.capabilities) ? data.capabilities : [],
        valuePropositions: Array.isArray(data.valuePropositions) ? data.valuePropositions : []
      };

    case 'saap':
      return {
        ...baseData,
        pricingModel: data.pricingModel || '',
        integrations: Array.isArray(data.integrations) ? data.integrations : [],
        apiSupport: Boolean(data.apiSupport)
      };

    case 'electric vehicles':
      return {
        ...baseData,
        batteryCapacity: data.batteryCapacity || '',
        range: data.range || '',
        chargingTime: data.chargingTime || '',
        motorType: data.motorType || ''
      };

    case 'furnitures':
      return {
        ...baseData,
        material: Array.isArray(data.material) ? data.material : [],
        dimensions: data.dimensions || '',
        weight: data.weight || '',
        assemblyRequired: Boolean(data.assemblyRequired)
      };

    case 'garments':
      return {
        ...baseData,
        sizes: Array.isArray(data.sizes) ? data.sizes : [],
        colors: Array.isArray(data.colors) ? data.colors : [],
        fabric: Array.isArray(data.fabric) ? data.fabric : [],
        careInstructions: Array.isArray(data.careInstructions) ? data.careInstructions : []
      };

    default:
      return baseData;
  }
};

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const category = url.searchParams.get('category');
        
        let response = await getProjects();
        
        // Filter by category if provided
        if (category && category !== 'all' && PRODUCT_CATEGORIES.includes(category)) {
            if (Array.isArray(response.data)) {
                response.data = response.data.filter((project: any) => project.category === category);
            }
        }
        
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        let getobj = await cookies();
        let token = getobj.get("token");
        let resultjst = await VerifyJwt(token?.value ?? "");
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);
        
        if (!userdata?.data?._id) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized access" 
            }, { status: 401 });
        }

        let body = await req.json();
        
        // Validate project data
        const validationErrors = validateProjectData(body);
        if (validationErrors.length > 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Validation failed",
                errors: validationErrors
            }, { status: 400 });
        }

        // Clean and prepare project data
        const cleanedData = cleanProjectData(body);
        const projectData = {
            ...cleanedData,
            lastEditedAuthor: userdata.data._id,
            author: userdata.data._id
        };

        let response = await addProject(projectData);
        return NextResponse.json({ 
            success: true, 
            message: "Project added successfully",
            data: response 
        });
    } catch (error) {
        console.error('Error adding project:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        });
    }
}

export const PUT = async (req: NextRequest) => {
    try {
        let getobj = await cookies();
        let token = getobj.get("token");
        let resultjst = await VerifyJwt(token?.value ?? "");
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);
        
        if (!userdata?.data?._id) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized access" 
            }, { status: 401 });
        }

        let body = await req.json();
        
        if (!body.id) {
            return NextResponse.json({ 
                success: false, 
                message: "Project ID is required" 
            }, { status: 400 });
        }

        // Validate project data
        const validationErrors = validateProjectData(body);
        if (validationErrors.length > 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Validation failed",
                errors: validationErrors
            }, { status: 400 });
        }

        // Clean and prepare project data
        const cleanedData = cleanProjectData(body);
        const projectData = {
            ...cleanedData,
            lastEditedAuthor: userdata.data._id,
            updatedAt: new Date()
        };

        let response = await updateProject(body.id, projectData);
        return NextResponse.json({ 
            success: true, 
            message: "Project updated successfully",
            data: response 
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        let getobj = await cookies();
        let token = getobj.get("token");
        let resultjst = await VerifyJwt(token?.value ?? "");
        
        // Type guard to ensure resultjst is an object with a 'data' property containing 'email'
        if (
            !resultjst ||
            typeof resultjst !== "object" ||
            !("data" in resultjst) ||
            typeof (resultjst as any).data !== "object" ||
            !(resultjst as any).data.email
        ) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized access" 
            }, { status: 401 });
        }

        const body = await req.json();
        
        if (!body.id) {
            return NextResponse.json({ 
                success: false, 
                message: "Project ID is required" 
            }, { status: 400 });
        }

        let response = await deleteProject(body.id);
        return NextResponse.json({ 
            success: true, 
            message: "Project deleted successfully",
            data: response 
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        });
    }
}