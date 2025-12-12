export { ModernTemplate } from "./ModernTemplate";
export { MinimalTemplate } from "./MinimalTemplate";
export { ClassicTemplate } from "./ClassicTemplate";
export { BentoTemplate } from "./BentoTemplate";
export { TerminalTemplate } from "./TerminalTemplate";
export { GradientTemplate } from "./GradientTemplate";
export { ContactForm } from "./ContactForm";
export {
  type PortfolioData,
  type TemplateProps,
  TEMPLATES,
  ACCENT_COLORS,
  FONTS,
  getAccentClasses,
  getFontClass,
} from "./types";

import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { BentoTemplate } from "./BentoTemplate";
import { TerminalTemplate } from "./TerminalTemplate";
import { GradientTemplate } from "./GradientTemplate";
import type { TemplateProps } from "./types";

export const templateComponents: Record<string, React.ComponentType<TemplateProps>> = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  classic: ClassicTemplate,
  bento: BentoTemplate,
  terminal: TerminalTemplate,
  gradient: GradientTemplate,
};

export function getTemplateComponent(templateId: string): React.ComponentType<TemplateProps> {
  return templateComponents[templateId] || ModernTemplate;
}
