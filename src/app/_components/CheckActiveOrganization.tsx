"use client";

import { useEffect } from "react";
import { useOrganizationList, useAuth } from "@clerk/nextjs";

export default function CheckActiveOrganization() {
    const { userMemberships, setActive } = useOrganizationList({userMemberships: true});
    const { userId, orgId, isLoaded } = useAuth();

    useEffect(() => {
        if (!isLoaded || !setActive) {
            return;
        }
        // No active organization but the user is signed in, set the first one as active
        if (orgId == null && userId) {
            if (userMemberships.data.length > 0 && userMemberships.data[0]) {
                const firstOrg = userMemberships.data[0].organization;
                console.log("Setting first organization as active:", firstOrg.id);
                setActive({ organization: firstOrg.id });
            }
        }        
    }, [isLoaded, orgId]);

    return null;
}