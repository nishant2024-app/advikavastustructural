"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Eye, Heart, Shield, Users, Lightbulb, ChevronRight, Gem } from "lucide-react";

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

const timeline = [
    { year: "2009", title: "Founded", description: "Advika Vastu-Structural was established with a vision to transform architectural and Vastu consultancy in India." },
    { year: "2012", title: "50+ Projects", description: "Crossed 50 successful project completions across residential and commercial segments." },
    { year: "2015", title: "National Expansion", description: "Expanded operations to serve clients across 15+ states in India." },
    { year: "2018", title: "Digital Transformation", description: "Adopted cutting-edge CAD, BIM, and 3D visualization technologies." },
    { year: "2021", title: "200+ Clients", description: "Reached the milestone of 200+ satisfied clients with a 98% satisfaction rate." },
    { year: "2024", title: "All India Coverage", description: "Full operational coverage across all Indian states with 500+ completed projects." },
];

const values = [
    { icon: Shield, title: "Integrity", description: "We uphold the highest standards of honesty and transparency in everything we do." },
    { icon: Lightbulb, title: "Innovation", description: "Constantly pushing the boundaries of architectural design with modern technologies." },
    { icon: Heart, title: "Client Focus", description: "Every project is centered around understanding and exceeding client expectations." },
    { icon: Award, title: "Excellence", description: "We strive for excellence in design, quality, and project delivery." },
    { icon: Users, title: "Collaboration", description: "Working together with clients and partners to achieve the best outcomes." },
    { icon: Gem, title: "Quality", description: "Uncompromising commitment to quality in every drawing, plan, and consultation." },
];

interface Props { settings: Record<string, any>; }

export default function AboutContent({ settings }: Props) {
    const stats = [
        { value: settings.stats_projects || "500+", label: "Projects Completed" },
        { value: settings.stats_clients || "200+", label: "Happy Clients" },
        { value: settings.stats_states || "28+", label: "States Covered" },
        { value: settings.stats_experience || "15+", label: "Years Experience" },
    ];

    return (
        <>
            {/* Hero Banner */}
            <section className="sky-gradient text-white section-padding !pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" /></div>
                <div className="container-wide relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                        <p className="text-white/70 text-lg">Over {settings.stats_experience || "15+"} years of excellence in architecture, planning, and consultancy services across India.</p>
                    </motion.div>
                </div>
            </section>

            {/* Company Introduction */}
            <section className="section-padding bg-white">
                <div className="container-wide">
                    <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div variants={fadeInUp}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-primary/10 text-sky-primary text-sm font-medium mb-4"><Award className="w-4 h-4" /> Our Story</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-6">Building India&apos;s Future, <span className="text-gradient">One Design at a Time</span></h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>{settings.about_intro || "Advika Vastu-Structural was founded in 2009 with a simple mission – to make quality architectural planning and Vastu consultancy accessible to everyone. Starting from a small office, we have grown into one of India's most trusted names in the field."}</p>
                                <p>With a team of experienced architects, engineers, and planners, we bring a blend of traditional knowledge and modern technology to every project. Our portfolio spans residential homes, commercial complexes, industrial facilities, and heritage restoration projects.</p>
                                <p>Today, we serve clients across all Indian states, offering comprehensive services from initial concept to final delivery. Our commitment to quality, innovation, and client satisfaction remains at the heart of everything we do.</p>
                            </div>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <div className="bg-gradient-to-br from-sky-primary/5 to-sky-dark/10 rounded-3xl p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="text-center">
                                            <p className="text-3xl font-bold text-sky-primary mb-1">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Founder Profile */}
            <section className="section-padding bg-section-gray">
                <div className="container-wide max-w-4xl">
                    <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger} className="text-center">
                        <motion.div variants={fadeInUp}>
                            <div className="w-24 h-24 rounded-full sky-gradient flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-primary/20"><span className="text-4xl">👤</span></div>
                            <h2 className="text-2xl md:text-3xl font-bold text-dark-blue mb-2">{settings.founder_name || "Founder & Principal Architect"}</h2>
                            <p className="text-sky-primary font-medium mb-6">{settings.founder_role || "Advika Vastu-Structural"}</p>
                            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                {settings.founder_bio || "With over 15 years of experience in architectural planning and structural consultancy, our founder has led the firm from a local practice to an all-India consultancy. Their vision of combining traditional architectural wisdom with modern technology has been the cornerstone of the firm's success."}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section-padding bg-white">
                <div className="container-wide max-w-4xl">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-primary/10 text-sky-primary text-sm font-medium mb-4">Our Journey</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-dark-blue">Experience <span className="text-gradient">Timeline</span></h2>
                    </div>
                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-sky-primary/20" />
                        <div className="space-y-12">
                            {timeline.map((item, i) => (
                                <motion.div key={item.year} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                    className={`relative flex items-start gap-6 md:gap-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full sky-gradient border-4 border-white shadow-md z-10" />
                                    <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                                        <span className="text-sky-primary font-bold text-lg">{item.year}</span>
                                        <h3 className="text-xl font-semibold text-dark-blue mt-1">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding bg-section-gray">
                <div className="container-wide">
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <Card className="h-full border-0 shadow-sm bg-white">
                                <CardContent className="p-8">
                                    <div className="w-14 h-14 rounded-2xl sky-gradient flex items-center justify-center mb-5 shadow-lg shadow-sky-primary/20"><Target className="w-7 h-7 text-white" /></div>
                                    <h3 className="text-xl font-bold text-dark-blue mb-3">Our Mission</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {settings.mission || "To democratize quality architectural services by making professional planning, design, and consultancy accessible and affordable for every Indian household and business, while maintaining the highest standards of excellence."}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <Card className="h-full border-0 shadow-sm bg-white">
                                <CardContent className="p-8">
                                    <div className="w-14 h-14 rounded-2xl sky-gradient flex items-center justify-center mb-5 shadow-lg shadow-sky-primary/20"><Eye className="w-7 h-7 text-white" /></div>
                                    <h3 className="text-xl font-bold text-dark-blue mb-3">Our Vision</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {settings.vision || "To become India's most trusted architectural consultancy firm, known for innovation, integrity, and impactful designs that shape communities and transform the built environment across the nation."}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section-padding bg-white">
                <div className="container-wide">
                    <div className="text-center mb-14"><h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">Our Core <span className="text-gradient">Values</span></h2></div>
                    <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value) => (
                            <motion.div key={value.title} variants={fadeInUp}>
                                <Card className="h-full border-0 shadow-sm bg-section-gray hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <CardContent className="p-7">
                                        <div className="w-12 h-12 rounded-xl bg-sky-primary/10 flex items-center justify-center mb-4"><value.icon className="w-6 h-6 text-sky-primary" /></div>
                                        <h3 className="text-lg font-semibold text-dark-blue mb-2">{value.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding sky-gradient text-white text-center">
                <div className="container-wide">
                    <h2 className="text-3xl font-bold mb-4">Let&apos;s Build Something Great Together</h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">Partner with us for your next architectural project and experience the Advika Vastu-Structural difference.</p>
                    <Button asChild size="lg" className="bg-white text-sky-primary hover:bg-white/90 font-semibold shadow-xl px-8">
                        <Link href="/contact">Start Your Project <ChevronRight className="w-4 h-4 ml-1" /></Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
