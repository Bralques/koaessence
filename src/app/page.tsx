import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Collection from "@/components/Collection";
import Materials from "@/components/Materials";
import Story from "@/components/Story";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Collection />
        <Materials />
        <Story />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
