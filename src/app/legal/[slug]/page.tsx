import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLegalPage, getAllLegalPages } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function LegalPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = await getLegalPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <>
            <section className="sky-gradient text-white section-padding !pb-12">
                <div className="container-wide">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold">{page.title}</h1>
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="container-wide max-w-3xl">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 md:p-10">
                            <div
                                className="prose prose-slate max-w-none prose-headings:text-dark-blue prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-dark-blue"
                                dangerouslySetInnerHTML={{ __html: formatMarkdown(page.content) }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    );
}

function formatMarkdown(content: string): string {
    let html = content.trim();
    html = html.replace(/## (.+)/g, '</p><h2>$1</h2><p>');
    html = html.replace(/- (.+)/g, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>\s*<h2>/g, '<h2>');
    html = html.replace(/<\/h2>\s*<\/p>/g, '</h2>');
    html = html.replace(/<p>\s*<ul>/g, '<ul>');
    html = html.replace(/<\/ul>\s*<\/p>/g, '</ul>');
    return html;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getLegalPage(slug);
    return {
        title: page?.title || "Legal",
        description: `${page?.title || "Legal page"} - Advika Vastu-Structural`,
    };
}
