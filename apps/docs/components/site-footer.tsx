import {
  BorderFlash,
  BorderFlashBox,
  BorderFlashBoxContent,
} from "@rlz/ui/components/animations/border-flash";

export function SiteFooter() {
  return (
    <div className="relative">
      <BorderFlash
        border="top"
        animation="left"
        className="border-sidebar-border"
      />

      <div className="container pointer-events-none absolute inset-0 overflow-visible">
        <BorderFlashBox className="absolute -top-[4.5px] -left-[11.5px] -ml-1 size-2 rounded-[2px] bg-background shadow-xs/5 p-0 z-50">
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>

        <BorderFlashBox className="absolute -top-[4.5px] -right-[11.5px] -mr-1 size-2 rounded-[2px] bg-background shadow-xs/5 dark:bg-clip-border p-0 z-50">
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
      </div>

      <footer className="bg-sidebar-background text-muted-foreground h-(--header-height) text-sm w-full flex items-center justify-center gap-1">
        Built by Rlzee,{" "}
        <a
          href="https://github.com/Rlzee/rlz-ui"
          className="text-primary hover:underline"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
