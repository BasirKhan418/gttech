import ConnectDb from "../../middlewares/connectdb";
import Project from "../../models/Project";
import { slugify } from "../../utils/slugify";

const generateUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
    const base = slugify(title);
    let slug = base;
    let counter = 1;
    while (true) {
        const query: any = { slug };
        if (excludeId) query._id = { $ne: excludeId };
        const existing = await Project.findOne(query);
        if (!existing) break;
        slug = `${base}-${counter++}`;
    }
    return slug;
};

const getProjects = async () => {
    try {
        await ConnectDb();
        let data = await Project.find({})
            .populate("author lastEditedAuthor")
            .sort({ createdAt: -1 });

        // Auto-backfill slugs for any project that doesn't have one
        const missing = data.filter((p: any) => !p.slug);
        if (missing.length > 0) {
            for (const project of missing) {
                const slug = await generateUniqueSlug(project.title, project._id.toString());
                await Project.findByIdAndUpdate(project._id, { slug });
                project.slug = slug;
            }
        }

        return { success: true, message: "Projects fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const addProject = async (data: any) => {
    try {
        await ConnectDb();
        if (!data.slug && data.title) {
            data.slug = await generateUniqueSlug(data.title);
        }
        let newProject = new Project(data);
        await newProject.save();
        return { success: true, message: "Project added successfully", data: newProject };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateProject = async (id: string, data: any) => {
    try {
        await ConnectDb();
        if (data.title) {
            const existing = await Project.findById(id);
            if (existing && (!existing.slug || existing.title !== data.title)) {
                data.slug = await generateUniqueSlug(data.title, id);
            }
        }
        let updatedProject = await Project.findByIdAndUpdate(id, data, { new: true });
        if (!updatedProject) {
            return { success: false, message: "Project not found" };
        }
        return { success: true, message: "Project updated successfully", data: updatedProject };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const deleteProject = async (id: string) => {
    try {
        await ConnectDb();
        let deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            return { success: false, message: "Project not found" };
        }
        return { success: true, message: "Project deleted successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const getProjectById = async (id: string) => {
    try {
        await ConnectDb();
        let project = await Project.findById(id).populate("author lastEditedAuthor");
        if (!project) {
            return { success: false, message: "Project not found" };
        }
        return { success: true, message: "Project fetched successfully", data: project };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const getProjectBySlug = async (slug: string) => {
    try {
        await ConnectDb();
        // Try slug first, fall back to _id for backward compatibility
        let project = await Project.findOne({ slug }).populate("author lastEditedAuthor");
        if (!project && slug.match(/^[a-f\d]{24}$/i)) {
            project = await Project.findById(slug).populate("author lastEditedAuthor");
        }
        if (!project) {
            return { success: false, message: "Project not found" };
        }
        return { success: true, message: "Project fetched successfully", data: project };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

export { getProjects, addProject, updateProject, deleteProject, getProjectById, getProjectBySlug };