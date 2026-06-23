"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  testimonial: string
  rating: number
  imageSrc: string
}

export default function TestimonialCard({ name, role, testimonial, rating, imageSrc }: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)
  const textRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (expanded) return

    const element = textRef.current
    if (!element) return

    const updateOverflowState = () => {
      setCanExpand(element.scrollHeight > element.clientHeight + 1)
    }

    updateOverflowState()

    const resizeObserver = new ResizeObserver(updateOverflowState)
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [testimonial, expanded])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="h-full w-full flex"
    >
      <Card
        className={`h-full w-full flex flex-col justify-between bg-white/70 dark:bg-black/40 backdrop-blur-md border border-primary/10 shadow-lg transition-all duration-200 hover:shadow-2xl hover:bg-primary/10 rounded-2xl min-h-[320px] ${
          expanded ? "max-h-none overflow-visible" : "max-h-[380px] overflow-hidden"
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{
                scale: 1.12,
                boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.15)",
                transition: { duration: 0.3 }
              }}
              className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 shadow"
            >
              <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-muted-foreground">{role}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className={`flex-grow flex flex-col items-center gap-3 ${expanded ? "justify-start" : "justify-center"}`}>
          <div className="w-full">
            <p
              ref={textRef}
              className={`italic text-center text-base px-2 text-pretty break-words transition-all duration-300 ${expanded ? "whitespace-normal" : "overflow-hidden"}`}
              style={
                expanded
                  ? { display: "block" }
                  : {
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 4
                    }
              }
            >
              "{testimonial}"
            </p>
          </div>

          {canExpand && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </CardContent>

        <CardFooter className="pt-2 flex justify-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.2, y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Star className={`w-5 h-5 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
              </motion.span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
