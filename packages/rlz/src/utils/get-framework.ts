import { getPackageInfo } from "./get-package-info";

export type Framework = 
  | "next.js"
  | "react"
  | "vue"
  | "nuxt"
  | "svelte"
  | "sveltekit"
  | "astro"
  | "remix"
  | "gatsby"
  | "vite"
  | "angular"
  | "solid"
  | "qwik"
  | "unknown";

export function getFramework(cwd?: string): Framework {
  try {
    const packageInfo = getPackageInfo(cwd, false);
    
    if (!packageInfo) {
      return "unknown";
    }

    const dependencies = {
      ...packageInfo.dependencies,
      ...packageInfo.devDependencies,
    };

    if (dependencies["next"]) {
      return "next.js";
    }
    
    if (dependencies["nuxt"]) {
      return "nuxt";
    }
    
    if (dependencies["@sveltejs/kit"]) {
      return "sveltekit";
    }
    
    if (dependencies["svelte"]) {
      return "svelte";
    }
    
    if (dependencies["@remix-run/react"] || dependencies["@remix-run/node"]) {
      return "remix";
    }
    
    if (dependencies["gatsby"]) {
      return "gatsby";
    }
    
    if (dependencies["astro"]) {
      return "astro";
    }
    
    if (dependencies["@angular/core"]) {
      return "angular";
    }
    
    if (dependencies["solid-js"]) {
      return "solid";
    }
    
    if (dependencies["@builder.io/qwik"]) {
      return "qwik";
    }
    
    if (dependencies["vue"]) {
      return "vue";
    }
    
    if (dependencies["vite"]) {
      return "vite";
    }
    
    if (dependencies["react"]) {
      return "react";
    }

    return "unknown";
  } catch (error) {
    console.error("Error in detecting the framework:", error);
    return "unknown";
  }
}