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
    loadGallery(gallery, subject, content.visitor, content.visit)
}

async function loadGallery(gallery: string, subject: string, visitor: any, visits: any) {
    let result: { galleryID: number; personName?: string; fullURL?: string; uploaded?: string; filename?: string; name?: string; height?: number; width?: number; bsn?: string; exposureTime?: number; iso?: number; lens?: string; fn?: number; fl?: number; comment?: string; model?: string; date?: string; }[] = []
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
            console.log("unavailable")
        } else {
            content.imageData.categories.forEach(obj => {
                obj.images.forEach(image => {
                    result.push({
                        galleryID: image.galleryID,
                        personName: obj.name,
                        fullURL: `${content.imageData.onDemandUrl}600/${image.name}`, 
                        uploaded: image.timestamp, 
                        filename: image.filename, 
                        name: image.name, 
                        height: image.height, 
                        width: image.width, 
                        bsn: image.exif.BodySerialNumber, 
                        exposureTime: image.exif.ExposureTime, 
                        iso: image.exif.ISO, 
                        lens: image.exif.LensModel,
                        fn: image.exif.FNumber,
                        fl: image.exif.FocalLength, 
                        comment: image.exif.UserComment, 
                        model: image.exif.Model, 
                        date: image.exif.DateTimeOriginal, 
                    })
                })
                console.log(result)
            })          
        }
    }
    catch {
        console.log("er")
        let pass
    }
    
}       
            

getGalleries("")

