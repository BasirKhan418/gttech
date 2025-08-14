import ConnectDb from "../../middlewares/connectdb";
import Project from "../../models/Project";

const getProjects = async () => {
    try {
        await ConnectDb();
        let data = await Project.find({})
            .populate("author lastEditedAuthor")
            .sort({ createdAt: -1 });
        return { success: true, message: "Projects fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const addProject = async (data: any) => {
    try {
        await ConnectDb();
        let newProject = new Project(data);
        await newProject.save();
        return { success: true, message: "Project added successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateProject = async (id: string, data: any) => {
    try {
        await ConnectDb();
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

export { getProjects, addProject, updateProject, deleteProject, getProjectById };