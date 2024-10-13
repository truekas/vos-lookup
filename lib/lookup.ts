"use strict";

import { siteConfig } from "@/config/site";

function getGalleries(code: string) {
    const url = `https://api.imagequix.com/vando/customer/${siteConfig.customerId}/gallery?code=${code}`
    fetch(url)
    .then(response => response.json())
    .then(data => {
        data.forEach(obj => {
            meowMeow428(obj.id, obj.subjectID)
        })      
    })
}

async function meowMeow428(gallery: string, subject: string) {
    const res = await fetch("https://api.imagequix.com/vando/visitor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON. stringify({ custID: siteConfig.customerId, galleryID: gallery, email: "a@a.aa", subjectID: subject })
    })
    const content = await res.json()
    const result = await loadGallery(gallery, subject, content.visitor, content.visit)
    console.log(result)
}

async function loadGallery(gallery: string, subject: string, visitor: any, visits: any) {
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
            content.imageData.categories.forEach(obj => {
                obj.images.forEach(image => {
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
                        bsn: image.exif.BodySerialNumber || "None (group photo)", 
                        exposureTime: image.exif.ExposureTime, 
                        iso: image.exif.ISO || 100, 
                        lens: image.exif.LensModel || "Most Likely EF24-105mm f/4L IS USM",
                        fn: image.exif.FNumber,
                        fl: image.exif.FocalLength, 
                        comment: image.exif.UserComment || "", 
                        model: image.exif.Model || "Most Likely Canon EOS 6D Mark II", 
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
            
getGalleries("1853413")

