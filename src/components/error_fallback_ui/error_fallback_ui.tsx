import React from 'react';
import {
  EmptyState,
  PageSection,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { OutlinedSmileBeamIcon } from '@patternfly/react-icons';

export const ErrorFallbackUI = () => {
  return (
    <PageSection style={{ height: '100%' }}>
      <>
        <EmptyState>
          <EmptyStateIcon icon={OutlinedSmileBeamIcon} />
          <Title size="lg" headingLevel="h4">
            You've found an unexpected feature.
          </Title>
          <EmptyStateBody>
            <p>
              First, try refreshing your browser and navigating back to this
              page.
            </p>
            <p>If that doesn't work, please send an email to the SRE team.</p>
          </EmptyStateBody>
        </EmptyState>
      </>
    </PageSection>
  );
};
