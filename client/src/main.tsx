import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// SEO and meta tags setup
document.title = "INNOVACIÓN 2026 - Multiverse Tech Fest";

const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
  metaDescription.setAttribute('content', 'Join INNOVACIÓN 2026 - The ultimate techno-management fest exploring the multiverse of innovation. Experience 25+ events across robotics, AI, gaming, and management dimensions.');
}

createRoot(document.getElementById("root")!).render(<App />);
