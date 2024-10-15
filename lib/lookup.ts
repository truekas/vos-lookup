"use strict";

import { siteConfig } from "@/config/site";

async function meowMeow851(code: string) {
    let promises: any[] = [];
    const url = `https://api.imagequix.com/vando/customer/${siteConfig.customerId}/gallery?code=${code}`;

    return fetch(url)
    .then(response => response.json())
    .then(data => {
        data.forEach((obj: { id: string; subjectID: string; }) => {
            promises.push(
                fetch("https://api.imagequix.com/vando/visitor", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        custID: siteConfig.customerId,
                        galleryID: obj.id,
                        email: "a@a.aa",
                        subjectID: obj.subjectID,
                    }),
                })
                .then(res => res.json())
                .then(content => meowMeow566(obj.id, obj.subjectID, content.visitor, content.visit))
            );
        });

        return Promise.all(promises)
    });
}


async function meowMeow566(gallery: string, subject: string, visitor: any, visits: any) {
    let result: { success: boolean; galleryID: number; personName?: string; isGroup?: boolean; fullURL?: string; uploaded?: string; filename?: string; name?: string; height?: number; width?: number; bsn?: string; exposureTime?: number; iso?: number; lens?: string; fn?: number; fl?: number; comment?: string; model?: string; date?: string; }[] = []
    const visit = {[`${gallery}`]: {[`${subject}`]: {"id": visits.id}, "custID": siteConfig.customerId, "galleryID": gallery, "token": null}}
    delete visitor.contact
    const url = `https://api.imagequix.com/vando/gallery/${gallery}/load/${subject}`
    const res = await fetch(url, {
        headers: {
            "Cookie": `iq-vando-visitor=${encodeURIComponent(JSON.stringify(visitor))}; iq-vando-visits=${encodeURIComponent(JSON.stringify(visit))};`
        }
    })
    try {
        const content = await res.json()
        if (!content.imageData || !content.imageData.categories[0].primaryImage) {
            result.push({ success: false, galleryID: parseInt(gallery) })
        } else {
            content.imageData.categories.forEach((obj: { images: { galleryID: any; name: any; timestamp: any; filename: any; height: any; width: any; exif: { BodySerialNumber: any; ExposureTime: any; ISO: any; LensModel: any; FNumber: any; FocalLength: any; UserComment: any; Model: any; DateTimeOriginal: any; }; }[]; name: any; isGroup: any; }) => {
                obj.images.forEach((image: { galleryID: any; name: any; timestamp: any; filename: any; height: any; width: any; exif: { BodySerialNumber: any; ExposureTime: any; ISO: any; LensModel: any; FNumber: any; FocalLength: any; UserComment: any; Model: any; DateTimeOriginal: any; }; }) => {
                    result.push({
                        success: true,
                        galleryID: image.galleryID || gallery,
                        personName: obj.name,
                        isGroup: obj.isGroup || false,
                        fullURL: `${content.imageData.onDemandUrl}600/${image.name}`, 
                        uploaded: image.timestamp, 
                        filename: image.filename, 
                        name: image.name, 
                        height: image.height, 
                        width: image.width, 
                        bsn: image.exif.BodySerialNumber || "none (group photo)", 
                        exposureTime: image.exif.ExposureTime || 0.008, 
                        iso: image.exif.ISO || 100, 
                        lens: image.exif.LensModel || "most likely ef24-105mm f/4l is usm",
                        fn: image.exif.FNumber || 7.1,
                        fl: image.exif.FocalLength || 105, 
                        comment: image.exif.UserComment || "", 
                        model: image.exif.Model || "most likely canon eos 6d mark ii", 
                        date: image.exif.DateTimeOriginal || image.timestamp, 
                    })
                })
            })       
        }
    }
    catch {
        let pass
    }
    return result;
}       
            
async function meowMeow394(code: string) {
    const galleries = (await meowMeow851(code)).flat()
    return galleries;
}

async function byGallery(code: string) {
    //not done yet !!
}                   

export { meowMeow394 }