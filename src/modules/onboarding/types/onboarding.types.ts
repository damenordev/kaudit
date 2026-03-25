export type TOnboardingStep = 'welcome' | 'general' | 'appearance' | 'typography' | 'profile' | 'complete'

export interface IOnboardingStepConfig {
  id: TOnboardingStep
  titleKey: string
  descriptionKey: string
  isSkippable: boolean
}

export const ONBOARDING_STEPS: IOnboardingStepConfig[] = [
  { id: 'welcome', titleKey: 'welcome.title', descriptionKey: 'welcome.description', isSkippable: false },
  { id: 'general', titleKey: 'general.title', descriptionKey: 'general.description', isSkippable: true },
  { id: 'appearance', titleKey: 'appearance.title', descriptionKey: 'appearance.description', isSkippable: true },
  { id: 'typography', titleKey: 'typography.title', descriptionKey: 'typography.description', isSkippable: true },
  { id: 'profile', titleKey: 'profile.title', descriptionKey: 'profile.description', isSkippable: true },
  { id: 'complete', titleKey: 'complete.title', descriptionKey: 'complete.description', isSkippable: false },
]

export const ONBOARDING_TOTAL_STEPS = ONBOARDING_STEPS.length
