import ConnectDb from "../../middlewares/connectdb";
import Team from "../../models/Team";

const getTeams = async () => {
    try {
        await ConnectDb();
        let data = await Team.find();
        return { success: true, message: "Teams fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const addTeam = async (data: any) => {
    try {
        await ConnectDb();
        let newTeam = new Team(data);
        await newTeam.save();
        return { success: true, message: "Team added successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateTeam = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let updatedTeam = await Team.findByIdAndUpdate(id, data, { new: true });
        if (!updatedTeam) {
            return { success: false, message: "Team not found" };
        }
        return { success: true, message: "Team updated successfully", data: updatedTeam };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const deleteTeam = async (id: string) => {
    try {
        await ConnectDb();
        let deletedTeam = await Team.findByIdAndDelete(id);
        if (!deletedTeam) {
            return { success: false, message: "Team not found" };
        }
        return { success: true, message: "Team deleted successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

export { getTeams, addTeam, updateTeam, deleteTeam };