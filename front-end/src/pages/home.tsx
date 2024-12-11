import React, { Suspense, useEffect, useReducer, useState } from 'react';

import type IArtifact from '@/interfaces/artifact';
import type { TContractType } from '@/sdk/src/types';

import { Loader2 } from 'lucide-react';

import stepBackground from '@/assets/images/step.svg';
import BorderedContainer from '@/components/bordered-container';
import ContractCreationSteps from '@/components/contract-creation-steps';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import chainConfig from '@/config/chain';
import EReducerState from '@/constants/reducer-state';
import { auditContractInitialState, auditContractReducer } from '@/reducers/audit-contract';
import { compileContractInitialState, compileContractReducer } from '@/reducers/compile-contract';
import {
  generateContractInitialState,
  generateContractReducer
} from '@/reducers/generate-contract';
import {
  predefinedPromptsInitialState,
  predefinedPromptsReducer
} from '@/reducers/predefined-prompts';
import { LlmService } from '@/sdk/llmService.sdk';

const HeaderSection = React.lazy(() => import('@/components/sections/header'));
const TemplatesSection = React.lazy(() => import('@/components/sections/templates'));
const PromptSection = React.lazy(() => import('@/components/sections/prompt'));
const AuditSection = React.lazy(() => import('@/components/sections/audit'));
const CodeViewerSection = React.lazy(() => import('@/components/sections/code-viewer'));

export default function HomePage() {
  const activeTemplates = chainConfig.templates.filter((template) => template.isActive);

  const [activeTemplateName, setActiveTemplateName] = useState(activeTemplates[0]?.name || '');
  const [userPrompt, setUserPrompt] = useState('');

  const [predefinedPromptsState, dispatchPredefinedPrompts] = useReducer(
    predefinedPromptsReducer,
    predefinedPromptsInitialState
  );

  const [generateContractState, dispatchGenerateContract] = useReducer(
    generateContractReducer,
    generateContractInitialState
  );

  const [compileContractState, dispatchCompileContract] = useReducer(
    compileContractReducer,
    compileContractInitialState
  );

  const [auditContractState, dispatchAuditContract] = useReducer(
    auditContractReducer,
    auditContractInitialState
  );

  useEffect(() => {
    const fetchPredefinedPrompts = async () => {
      try {
        dispatchPredefinedPrompts({ state: EReducerState.reset, payload: null });

        const promptsResponse = await LlmService.getPromptByTemplate(
          activeTemplateName as TContractType
        );

        if (!Array.isArray(promptsResponse)) {
          dispatchPredefinedPrompts({ state: EReducerState.error, payload: null });
          return;
        }

        setUserPrompt('');
        dispatchPredefinedPrompts({ state: EReducerState.success, payload: promptsResponse });
      } catch (error) {
        console.error('Error fetching prompts by template:', error);
        dispatchPredefinedPrompts({ state: EReducerState.error, payload: null });
      }
    };

    fetchPredefinedPrompts();
  }, [activeTemplateName]);

  const isGenerationLoading =
    generateContractState.isLoading ||
    compileContractState.isLoading ||
    auditContractState.isLoading;

  const isGenerationCompleted =
    [generateContractState, compileContractState, auditContractState].every(
      (state) => state.isSuccess || state.isError
    );

  const creationSteps = [
    {
      number: 1,
      step: 'Generating',
      isLoading: generateContractState.isLoading,
      isSuccess: generateContractState.isSuccess,
      isError: generateContractState.isError,
      isStepConnected: true
    },
    {
      number: 2,
      step: 'Compiling',
      isLoading: compileContractState.isLoading,
      isSuccess: compileContractState.isSuccess,
      isError: compileContractState.isError,
      isStepConnected: true
    },
    {
      number: 3,
      step: 'Auditing',
      isLoading: auditContractState.isLoading,
      isSuccess: auditContractState.isSuccess,
      isError: auditContractState.isError,
      isStepConnected: true
    },
    {
      number: 4,
      step: 'Completed',
      isLoading: false,
      isSuccess: isGenerationCompleted,
      isError: [generateContractState, compileContractState, auditContractState].every(
        (state) => state.isError
      ),
      isStepConnected: false
    }
  ];

  const handleContractCreation = async () => {
    try {
      dispatchGenerateContract({ state: EReducerState.reset, payload: null });
      dispatchCompileContract({ state: EReducerState.reset, payload: null });
      dispatchAuditContract({ state: EReducerState.reset, payload: null });

      const contractCode = await generateContract();
      if (contractCode) {
        await compileContract(contractCode);
        await auditContract(contractCode);
      }
    } catch (error) {
      console.error('Error in contract creation process:', error);
    }
  };

  const generateContract = async () => {
    try {
      dispatchGenerateContract({ state: EReducerState.start, payload: null });

      const contractCode = await LlmService.callCairoGeneratorLLM(
        userPrompt,
        activeTemplateName as TContractType
      );

      if (typeof contractCode !== 'string') {
        throw new Error('Invalid contract code response');
      }

      dispatchGenerateContract({ state: EReducerState.success, payload: contractCode });
      return contractCode;
    } catch (error) {
      console.error('Error generating contract:', error);
      dispatchGenerateContract({ state: EReducerState.error, payload: null });
      return null;
    }
  };

  const compileContract = async (contractCode: string) => {
    try {
      dispatchCompileContract({ state: EReducerState.start, payload: null });

      const response = await LlmService.buildCairoCode(contractCode);

      if (!response?.success) {
        throw new Error('Compilation failed');
      }

      dispatchCompileContract({ state: EReducerState.success, payload: response.artifact as IArtifact });
    } catch (error) {
      console.error('Error compiling contract:', error);
      dispatchCompileContract({ state: EReducerState.error, payload: null });
    }
  };

  const auditContract = async (contractCode: string) => {
    try {
      dispatchAuditContract({ state: EReducerState.start, payload: null });

      const auditResponse = await LlmService.callAuditorLLM(contractCode);

      if (!Array.isArray(auditResponse)) {
        throw new Error('Invalid audit response');
      }

      dispatchAuditContract({ state: EReducerState.success, payload: auditResponse });
    } catch (error) {
      console.error('Error auditing contract:', error);
      dispatchAuditContract({ state: EReducerState.error, payload: null });
    }
  };

  return (
    <div className="flex w-full max-w-[1140px] flex-col gap-y-5">
      <BorderedContainer
        className="bg-cover md:mt-16 md:bg-contain"
        style={{ background: `url(${stepBackground}) no-repeat` }}
      >
        <Suspense fallback={<Skeleton className="h-40 w-[95%] rounded-3xl" />}>
          <HeaderSection chainsName={chainConfig.name} chainsDocumentationLink={chainConfig.docs} />
        </Suspense>
      </BorderedContainer>

      <BorderedContainer>
        <Suspense fallback={<Skeleton className="h-60 w-[95%] rounded-3xl" />}>
          <TemplatesSection
            chainsName={chainConfig.name}
            templates={chainConfig.templates}
            activeTemplateName={activeTemplateName}
            setActiveTemplateName={setActiveTemplateName}
          />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-60 w-[95%] rounded-3xl" />}>
          <div className="flex w-full flex-col items-start">
            <PromptSection
              chainsName={chainConfig.name}
              predefinedPrompts={predefinedPromptsState.prompts
