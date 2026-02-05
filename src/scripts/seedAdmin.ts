import { UserRole } from "../constants/role";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth"; 

async function seedAdmin() {
    try {
        console.log("***** Admin Seeding Started....")
        const adminData = {
            name: "Admin Saheb",
            email: "admin@admin.com",
            role: UserRole.ADMIN,
            password: "admin1234"
        }

        console.log("***** Checking if Admin exists in DB...");
        const existingUser = await prisma.user.findUnique({
            where: { email: adminData.email }
        });

        if (existingUser) {
            console.log("!!! Admin already exists. Skipping seed.");
            return;
        }

        console.log("***** Creating Admin via Internal API...");
        
        // Use auth.api instead of fetch
        // This bypasses the 403 Origin error
        const user = await auth.api.signUpEmail({
            body: {
                email: adminData.email,
                password: adminData.password,
                name: adminData.name,
                // Ensure your auth config supports 'role' in the schema!
            }
        });

        if (user) {
            console.log("**** Admin created successfully");
            
            // Manually verify and set the role 
            // (since sign-up usually ignores roles for security)
            await prisma.user.update({
                where: { email: adminData.email },
                data: { 
                    emailVerified: true,
                    role: UserRole.ADMIN 
                }
            });
            console.log("**** Role and Verification updated!");
            console.log("******* SUCCESS ******");
        }

    } catch (error) {
        console.error("!!! Seed Failed:", error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

seedAdmin();