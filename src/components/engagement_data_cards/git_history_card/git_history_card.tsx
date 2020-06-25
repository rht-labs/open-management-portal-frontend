import React from 'react';
import { DataCard } from '../data_card';
import { Engagement } from '../../../schemas/engagement_schema';
import { Grid, GridItem, Button, ButtonVariant } from '@patternfly/react-core';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { GitCommit } from '../../../schemas/git_commit';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { ActivityHistoryDetailsModal } from '../../engagement_edit_modals/activity_history_details_modal';
export interface GitHistoryCardProps {
  engagement: Engagement;
}
const GIT_COMMIT_MODAL_KEY = 'engagement_summary';

export function GitHistoryCard({ engagement }: GitHistoryCardProps) {
  const { requestOpen, activeModalKey } = useModalVisibility();
  const { activeEngagement: { commits } = {} } = useEngagements();
  return (
    <>
      <ActivityHistoryDetailsModal
        isOpen={activeModalKey?.includes(GIT_COMMIT_MODAL_KEY)}
      />
      <DataCard
        actionButton={() => (
          <Button
            variant={ButtonVariant.link}
            onClick={() => requestOpen(GIT_COMMIT_MODAL_KEY)}
          >
            View More
          </Button>
        )}
        title="Activity History"
      >
        <Grid hasGutter>
          <GridItem span={12}>
            <ActivityList
              commits={commits?.slice(
                0,
                commits?.length > 3 ? 3 : commits?.length
              )}
            />
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}

function ActivityList({ commits }: { commits: GitCommit[] }) {
  if (commits) {
    return (
      <>
        {commits.map(commit => (
          <ActivityListItem commit={commit} />
        ))}
      </>
    );
  }
  return <div />;
}

function ActivityListItem({ commit }: { commit: GitCommit }) {
  if (!commit) {
    return <div />;
  } else {
    return (
      <TitledDataPoint title={`${commit.author_email}`}>
        {commit.message}
      </TitledDataPoint>
    );
  }
}