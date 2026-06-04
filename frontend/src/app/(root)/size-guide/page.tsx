"use client";

import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sizeCharts = [
  {
    category: "Clothing (Men)",
    sizes: [
      { size: "S", chest: "36-38", waist: "30-32", length: "27-28" },
      { size: "M", chest: "38-40", waist: "32-34", length: "28-29" },
      { size: "L", chest: "40-42", waist: "34-36", length: "29-30" },
      { size: "XL", chest: "42-44", waist: "36-38", length: "30-31" },
      { size: "XXL", chest: "44-46", waist: "38-40", length: "31-32" },
    ],
    unit: "Inches",
  },
  {
    category: "Clothing (Women)",
    sizes: [
      { size: "XS", chest: "32-33", waist: "26-27", length: "30-31" },
      { size: "S", chest: "34-35", waist: "28-29", length: "31-32" },
      { size: "M", chest: "36-37", waist: "30-31", length: "32-33" },
      { size: "L", chest: "38-39", waist: "32-33", length: "33-34" },
      { size: "XL", chest: "40-41", waist: "34-35", length: "34-35" },
    ],
    unit: "Inches",
  },
  {
    category: "Footwear",
    sizes: [
      { size: "UK 6", chest: "9.6", waist: "24.5", length: "" },
      { size: "UK 7", chest: "9.9", waist: "25.2", length: "" },
      { size: "UK 8", chest: "10.2", waist: "25.9", length: "" },
      { size: "UK 9", chest: "10.5", waist: "26.6", length: "" },
      { size: "UK 10", chest: "10.8", waist: "27.3", length: "" },
    ],
    unit: "Centimeters (Foot Length)",
  },
];

const tips = [
  "Measure your body with a soft measuring tape, not a metal one",
  "Keep the tape snug but not tight - you should be able to insert one finger",
  "For chest: measure around the fullest part of your chest",
  "For waist: measure around your natural waistline (smallest part)",
  "For length: measure from shoulder seam to bottom hem",
  "If between sizes, size up for a comfortable fit",
];

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Size Guide
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Find Your Perfect Fit
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/70 text-lg"
          >
            Use our size charts to find the right size for you
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12 mb-16">
          {sizeCharts.map((chart, i) => (
            <motion.div
              key={chart.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-4">
                {chart.category}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{chart.unit}</p>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Size</th>
                      {Object.keys(chart.sizes[0]).filter(k => k !== 'size').map((key) => (
                        <th key={key} className="px-6 py-3 text-left text-sm font-semibold text-foreground capitalize">
                          {key === 'chest' && chart.category === 'Footwear' ? 'Foot Length' : key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.sizes.map((row, ri) => (
                      <tr key={row.size} className={ri % 2 === 0 ? 'bg-card' : 'bg-secondary/50'}>
                        <td className="px-6 py-3 text-sm font-medium text-foreground">{row.size}</td>
                        {Object.entries(row).filter(([k]) => k !== 'size').map(([key, val]) => (
                          <td key={key} className="px-6 py-3 text-sm text-muted-foreground">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Ruler className="w-6 h-6 text-primary" />
            Measuring Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <span className="text-sm text-muted-foreground">{tip}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
