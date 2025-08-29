import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../middlewares/connectdb";
import Services from "../../../../models/Services";

export const GET = async () => {
  try {
    await ConnectDb();
    const services = await Services.find({});
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage });
  }
};


export const POST = async (request: NextRequest) => {
  try {
    await ConnectDb();
    const body = await request.json();
    const newserv = new Services(body);
    await newserv.save();
    return NextResponse.json({ success: true, data: newserv });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage });
  }
};


export const PUT = async (request: NextRequest) => {
  try {
    await ConnectDb();
    const body = await request.json();
    const { id, ...updateData } = body;
    const updatedService = await Services.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updatedService });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    await ConnectDb();
    const { id } = await request.json();
    await Services.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage });
  }
};