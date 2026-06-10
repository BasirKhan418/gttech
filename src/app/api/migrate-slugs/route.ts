import { NextResponse } from "next/server";
import ConnectDb from "../../../../middlewares/connectdb";
import Project from "../../../../models/Project";
import { slugify } from "../../../../utils/slugify";

// One-time migration: backfill slugs on all projects that don't have one
export async function POST() {
    try {
        await ConnectDb();
        const projects = await Project.find({ slug: { $exists: false } });

        let updated = 0;
        for (const project of projects) {
            const base = slugify(project.title);
            let slug = base;
            let counter = 1;
            while (true) {
                const existing = await Project.findOne({ slug, _id: { $ne: project._id } });
                if (!existing) break;
                slug = `${base}-${counter++}`;
            }
            await Project.findByIdAndUpdate(project._id, { slug });
            updated++;
        }

        return NextResponse.json({ success: true, message: `Backfilled ${updated} slugs` });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Migration failed" }, { status: 500 });
    }
}
