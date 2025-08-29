import { NextResponse ,NextRequest} from "next/server";
import ConnectDb from "../../../../../middlewares/connectdb";
import Services from "../../../../../models/Services";

export const GET = async (request: NextRequest) => {
  try {
    await ConnectDb();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const service = await Services.findById(id);
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" });
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage });
  }
};
