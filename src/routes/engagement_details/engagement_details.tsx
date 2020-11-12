import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { useParams } from 'react-router';
import { getValidatorsFromEngagementFormConfig } from '../../common/config_validator_adapter';
import { Alert } from '@patternfly/react-core';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { EngagementDetailsViewTemplate } from '../../layout/engagement_details_view';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { EngagementOverview } from './overview';
import { useEngagementForm } from '../../context/engagement_form_context/engagement_form_hook';

export interface EngagementViewProps {
  currentEngagement?: Engagement;
}

export interface EngagementDetailViewProps {
  engagementFormConfig: EngagementFormConfig;
  getConfig: () => void;
  error: Error;
  setCurrentEngagement: (engagement: Engagement) => void;
  currentEngagement: Engagement;
  createEngagementPoll: (
    engagement: Engagement
  ) => Promise<{ cancel: () => void }>;
  getEngagement: (customer_name, project_name) => Promise<Engagement>;
}

export const EngagementDetailView = () => {
  const { project_name, customer_name } = useParams<{
    customer_name: string;
    project_name: string;
  }>();

  const {
    engagementFormConfig,
    getConfig,
    createEngagementPoll,
    error: engagementFormRequestError,
    setCurrentEngagement,
    getEngagement,
    currentEngagement,
    missingRequiredFields,
  } = useEngagements();

  const {
    saveChanges,
    currentChanges,
    updateEngagementFormField,
    clearCurrentChanges,
  } = useEngagementForm();
  useEffect(() => {
    let engagementPoll;
    if (currentEngagement?.project_name && currentEngagement?.customer_name) {
      engagementPoll = createEngagementPoll(currentEngagement);
    }
    return async () => {
      (await engagementPoll)?.cancel?.();
    };
  }, [currentEngagement, createEngagementPoll]);
  useEffect(() => {
    if (!engagementFormConfig) {
      getConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementFormConfig]);

  useEffect(() => {
    if (!customer_name || !project_name) {
      return;
    }
    getEngagement(customer_name, project_name).then(engagement => {
      if (engagement) {
        setCurrentEngagement(engagement);
      } else {
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer_name, project_name]);

  const AlertMessage = () => {
    return engagementFormRequestError ? (
      <Alert isInline title="We encountered an error." variant="danger">
        {engagementFormRequestError.message}
      </Alert>
    ) : null;
  };

  const validators = getValidatorsFromEngagementFormConfig(
    engagementFormConfig
  );
  return (
    <ValidationProvider validators={validators}>
      <EngagementDetailsViewTemplate
        engagement={currentEngagement}
        onSave={saveChanges}
      >
        <AlertMessage />
        <EngagementOverview
          currentEngagement={currentEngagement}
          missingRequiredFields={missingRequiredFields}
          onSave={saveChanges}
          engagementFormConfig={engagementFormConfig}
          onChange={updateEngagementFormField}
          currentEngagementChanges={currentChanges}
          clearCurrentChanges={clearCurrentChanges}
        />
      </EngagementDetailsViewTemplate>
    </ValidationProvider>
  );
};
