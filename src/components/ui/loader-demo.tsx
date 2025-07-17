import React from "react";
import { LoaderOne, LoaderTwo, LoaderThree } from "./loader";

export default function LoaderDemo() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Loaders Demo</h2>
        <p className="text-muted-foreground">Diferentes tipos de loaders para usar no app</p>
      </div>

      {/* LoaderOne Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">LoaderOne - Spinner</h3>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <LoaderOne size="sm" />
            <span className="text-sm text-foreground">Small</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne size="md" />
            <span className="text-sm text-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne size="lg" />
            <span className="text-sm text-foreground">Large</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">LoaderOne - Dots</h3>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <LoaderOne variant="dots" size="sm" />
            <span className="text-sm text-foreground">Small</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne variant="dots" size="md" />
            <span className="text-sm text-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne variant="dots" size="lg" />
            <span className="text-sm text-foreground">Large</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">LoaderOne - Bars</h3>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <LoaderOne variant="bars" size="sm" />
            <span className="text-sm text-foreground">Small</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne variant="bars" size="md" />
            <span className="text-sm text-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne variant="bars" size="lg" />
            <span className="text-sm text-foreground">Large</span>
          </div>
        </div>
      </div>

      {/* LoaderTwo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">LoaderTwo - Double Ring</h3>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <LoaderTwo size="sm" />
            <span className="text-sm text-foreground">Small</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderTwo size="md" />
            <span className="text-sm text-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderTwo size="lg" />
            <span className="text-sm text-foreground">Large</span>
          </div>
        </div>
      </div>

      {/* LoaderThree */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">LoaderThree - Triple Ring</h3>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <LoaderThree size="sm" />
            <span className="text-sm text-foreground">Small</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderThree size="md" />
            <span className="text-sm text-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderThree size="lg" />
            <span className="text-sm text-foreground">Large</span>
          </div>
        </div>
      </div>

      {/* Color Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Cores</h3>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <LoaderOne className="text-blue-500" />
            <span className="text-sm text-foreground">Blue</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne className="text-green-500" />
            <span className="text-sm text-foreground">Green</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne className="text-red-500" />
            <span className="text-sm text-foreground">Red</span>
          </div>
          <div className="flex items-center gap-2">
            <LoaderOne className="text-purple-500" />
            <span className="text-sm text-foreground">Purple</span>
          </div>
        </div>
      </div>
    </div>
  );
} 