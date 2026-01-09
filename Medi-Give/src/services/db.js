import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    serverTimestamp,
    deleteDoc
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- DONOR FUNCTIONS ---

export async function createDonation(donationData, imageFile) {
    try {
        let imageUrl = "";

        // 1. Upload Image (SKIPPED FOR HACKATHON TO AVOID BILLING)
        // if (imageFile) {
        //     const storageRef = ref(storage, `medicines/${Date.now()}_${imageFile.name}`);
        //     const snapshot = await uploadBytes(storageRef, imageFile);
        //     imageUrl = await getDownloadURL(snapshot.ref);
        // }

        // 2. Add to Firestore
        const docRef = await addDoc(collection(db, "donations"), {
            ...donationData,
            imageUrl,
            status: "Available", // Available, Requested, PickedUp
            createdAt: serverTimestamp()
        });

        return docRef.id;
    } catch (error) {
        console.error("Error adding donation:", error);
        throw error;
    }
}

// --- NGO FUNCTIONS ---

export async function getAvailableDonations() {
    try {
        const q = query(
            collection(db, "donations"),
            where("status", "==", "Available")
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching donations:", error);
        return [];
    }
}

export async function requestPickup(donationId, ngoId) {
    try {
        // 1. Update Donation Status
        const donationRef = doc(db, "donations", donationId);
        await updateDoc(donationRef, {
            status: "Requested",
            requestedBy: ngoId
        });

        // 2. Create Pickup Request Record
        const docRef = await addDoc(collection(db, "pickup_requests"), {
            donationId,
            ngoId,
            status: "Pending",
            requestedAt: serverTimestamp()
        });



        return docRef.id;
    } catch (error) {
        console.error("Error requesting pickup:", error);
        throw error;
    }
}

export async function getNgoRequests(ngoId) {
    try {
        const q = query(
            collection(db, "pickup_requests"),
            where("ngoId", "==", ngoId)
        );
        const querySnapshot = await getDocs(q);

        // In a real app, we would join with 'donations' collection to get medicine details
        // For Hackathon demo speed, we might just return the count or basic data
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching requests:", error);
        return [];
    }
}

export async function addWishlistItem(itemData) {
    try {
        const docRef = await addDoc(collection(db, "wishlists"), {
            ...itemData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding wishlist item:", error);
        throw error;
    }
}

export async function getAllUrgentRequests() {
    try {
        const q = query(
            collection(db, "wishlists"),
            where("urgency", "in", ["CRITICAL", "HIGH"])
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching urgent requests:", error);
        return [];
    }
}

export async function getAllWishlistItems() {
    try {
        const querySnapshot = await getDocs(collection(db, "wishlists"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching all wishlists:", error);
        return [];
    }
}

export async function deleteWishlistItem(id) {
    try {
        await deleteDoc(doc(db, "wishlists", id));
        return true;
    } catch (error) {
        console.error("Error deleting wishlist item:", error);
        throw error;
    }
}

export async function updatePickupStatus(requestId, status) {
    try {
        const requestRef = doc(db, "pickup_requests", requestId);
        await updateDoc(requestRef, {
            status: status
        });
        return true;
    } catch (error) {
        console.error("Error updating pickup status:", error);
        throw error;
    }
}

export async function getNgoWishlistItems(ngoId) {
    try {
        const q = query(
            collection(db, "wishlists"),
            where("ngoId", "==", ngoId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching ngo wishlists:", error);
        return [];
    }
}

export async function updateWishlistItem(id, data) {
    try {
        const docRef = doc(db, "wishlists", id);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.error("Error updating wishlist item:", error);
        throw error;
    }
}
