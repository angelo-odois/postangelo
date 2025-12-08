"use client";

import { HeroBlock } from "./HeroBlock";
import { TextBlock } from "./TextBlock";
import { ServicesGridBlock } from "./ServicesGridBlock";
import { ImageBlock } from "./ImageBlock";
import { ColumnsBlock } from "./ColumnsBlock";
import { StatsBlock } from "./StatsBlock";
import { FeaturesBlock } from "./FeaturesBlock";
import { FigmaEmbedBlock } from "./FigmaEmbedBlock";
import { TestimonialsBlock } from "./TestimonialsBlock";
import { AccordionBlock } from "./AccordionBlock";
import { VideoEmbedBlock } from "./VideoEmbedBlock";
import { CTABlock } from "./CTABlock";
import { PricingBlock } from "./PricingBlock";
import { DividerBlock } from "./DividerBlock";
import { SectionBlock } from "./SectionBlock";
import { CounterBlock } from "./CounterBlock";
import { ProgressBarBlock } from "./ProgressBarBlock";
import { TabsBlock } from "./TabsBlock";
import { ToggleBlock } from "./ToggleBlock";
import { CountdownBlock } from "./CountdownBlock";
import { LogoCloudBlock } from "./LogoCloudBlock";
import { TeamBlock } from "./TeamBlock";
import { TimelineBlock } from "./TimelineBlock";
import { GalleryBlock } from "./GalleryBlock";
import { FormBlock } from "./FormBlock";
import { ProcessBlock } from "./ProcessBlock";
import { BlockWrapper, BlockStyles } from "./BlockWrapper";

interface BlockProps {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  text: TextBlock,
  "services-grid": ServicesGridBlock,
  image: ImageBlock,
  columns: ColumnsBlock,
  stats: StatsBlock,
  features: FeaturesBlock,
  "figma-embed": FigmaEmbedBlock,
  testimonials: TestimonialsBlock,
  accordion: AccordionBlock,
  "video-embed": VideoEmbedBlock,
  cta: CTABlock,
  pricing: PricingBlock,
  divider: DividerBlock,
  section: SectionBlock,
  counter: CounterBlock,
  "progress-bar": ProgressBarBlock,
  tabs: TabsBlock,
  toggle: ToggleBlock,
  countdown: CountdownBlock,
  "logo-cloud": LogoCloudBlock,
  team: TeamBlock,
  timeline: TimelineBlock,
  gallery: GalleryBlock,
  form: FormBlock,
  process: ProcessBlock,
};

export function BlockRenderer({ block }: { block: BlockProps }) {
  const Component = blockComponents[block.type];

  if (!Component) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive text-center">
        Unknown block type: {block.type}
      </div>
    );
  }

  // Extract styles from props
  const { _styles, ...componentProps } = block.props;
  const styles = _styles as BlockStyles | undefined;

  // For Divider and Section, don't wrap since they handle their own spacing
  if (block.type === "divider" || block.type === "section") {
    return <Component {...componentProps} />;
  }

  // If styles are defined, wrap with BlockWrapper
  if (styles && Object.keys(styles).some(key => styles[key as keyof BlockStyles] !== undefined)) {
    return (
      <BlockWrapper styles={styles}>
        <Component {...componentProps} />
      </BlockWrapper>
    );
  }

  return <Component {...componentProps} />;
}
