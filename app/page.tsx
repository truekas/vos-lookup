'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as React from "react"
 
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';

const FormSchema = z.object({
  code: z
    .string()
    .length(7, {
      message: "id must be exactly 7 characters"
    })
    .refine(
      (value) => value.length === 7 && /^\d{7}$/.test(value),
      "id can only contain numbers"
    )
})

export default function ImageForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },  
  })

  // useState block 
  const [data, setData] = useState([{ name: "", fullURL: "", personName: "", uploaded: "", exposureTime: "", iso: "", model: "", lens: "", date: "", height: "", filename: "", bsn: "", width: "", fn: "", fl: "", isGroup: "", galleryID: "" }]);
  const [len, setLen] = React.useState(1);

  let formattedobj: any[] = []
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.code === "1712205") {
      setData([{ name: "", fullURL: "https://c.tenor.com/c5a_h8U1MzkAAAAC/tenor.gif", personName: "", uploaded: "", exposureTime: "", iso: "", model: "", lens: "", date: "", height: "", filename: "", bsn: "", width: "", fn: "", fl: "", isGroup: "", galleryID: ""}])
    } else {
      const res = await fetch("/api/lookup", {
        method: "POST",     
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: data.code })
      })
      const content = await res.json()
    
      const formattedobj: any[] = content.filter((obj: { success: boolean; }) => obj.success === true);

      setData(formattedobj)
      setLen(formattedobj.length)
      console.log(formattedobj)
    }
  }
  


  return (
    <div className="flex h-[80vh] w-screen flex-col items-center">
      <div className="flex w-full max-w-md flex-col items-center space-y-2">
        <div className="mt-[15vh] grid w-full place-items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-[-8vh] grid place-content-center text-3xl">victor o&apos;neill studios photo lookup</FormLabel>
                    <FormControl>
                      <Input placeholder="enter a student id to get started" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />      
                <Button type="submit" className="w-full">submit</Button>
              </form>
            </Form>
          </div>
        </div>
      <div className="mt-[7vh] h-[40vh] w-[55vw] flex-1">
        <Carousel>
            <CarouselContent>
              {Array.from({ length: len }).map((_, index) => (
                <CarouselItem key={index}>
                    <Card>
                      <CardContent className="flex h-[55vh] items-center justify-center p-2">
                        <Image width="400" height="600" className="ml-[0.3vw] rounded-lg" src={data[index]?.fullURL} alt={`Image of ${data[index]?.personName}`}/>
                        <div className="ml-[1.5vw] mr-[0.3vw] grid h-full w-[30vw] place-items-start">
                          <Card className="size-full rounded-lg p-6">
                            <CardContent>
                              <p className="text-4xl ">details</p>
                              <div className="grid w-full place-items-end">
                                <p className="mt-[-2vh] text-xs">protip: click on any value to copy it</p>
                              </div>
                              <ul className="mt-[1vh]">
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.personName.toLowerCase())}}>name :: <code>{data[index]?.personName.toLowerCase()}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.uploaded)}}>date uploaded :: <code>{data[index]?.uploaded}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.date)}}>date taken :: <code>{data[index]?.date}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.filename.toLowerCase())}}>filename on camera :: <code>{data[index]?.filename.toLowerCase()}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.name)}}>filename on server :: <code>{data[index]?.name}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.height)}}>height :: <code>{data[index]?.height}px</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.width)}}>width :: <code>{data[index]?.width}px</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.bsn)}}>body serial number :: <code>{data[index]?.bsn}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.exposureTime)}}>exposure time :: <code>{data[index]?.exposureTime}s</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.iso)}}>iso :: <code>{data[index]?.iso}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.model.toLowerCase())}}>camera model :: <code>{data[index]?.model.toLowerCase()}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.lens.toLowerCase())}}>lens model :: <code>{data[index]?.lens.toLowerCase()}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.fn)}}>f-stop :: ƒ/<code>{data[index]?.fn}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.fl)}}>focal length :: <code>{data[index]?.fl}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.isGroup)}}>group photo :: <code>{data[index]?.isGroup.toString()}</code></li>
                                <li onClick={() => {navigator.clipboard.writeText(data[index]?.galleryID)}}>gallery id :: <code>{data[index]?.galleryID}</code></li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>      
                    </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
      </div>
      <div className=" mt-[17vh] grid w-screen place-items-center">
        this site is in no way affiliated with, maintained, endorsed or sponsored by victor o&apos;neill studios llc or imagequix llc. this is an independent, unofficial site.
      </div>
    </div>
    
  );
}
