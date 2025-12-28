export default {
  plugins: {
    // Tailwind is now handled by the Vite plugin
    autoprefixer: {}, // Autoprefixer is still useful if not handled by lightningcss/vite plugin internally, but v4 usually handles prefixing too. 
    // Actually v4 might not need autoprefixer if using the vite plugin, but keeping it doesn't hurt usually, 
    // OR we can just remove this file if not needed.
    // Let's keep autoprefixer for now to be safe, but remove tailwindcss from here.
  },
}
