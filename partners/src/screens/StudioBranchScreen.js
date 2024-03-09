import React, { useState } from 'react';
import Footer from '../components/Footer';
import InfoChangeButton from '../components/Info/InfoChangeButton';
import NoticeMent from '../components/NoticeMent';
import PageTitle from '../components/PageTitle';
import Branch from '../components/Info/Branch';
import useMyStudio from '../hooks/useMyStudio';
import useRefresh from '../hooks/useRefresh';
import { gql, useMutation } from '@apollo/client';
import { ERROR_MESSAGE } from '../constants/errorMessages';
import { CONFIRM_INFO_UPDATE } from '../constants/messages';

const UPDATE_STUDIO_BRANCHES = gql`
  mutation UpdateStudioBranches(
    $slug: String!
    $payload: [UpdateBranchPayload!]!
  ) {
    updateBranches(input: { slug: $slug, payload: $payload }) {
      ok
      error
    }
  }
`;

const StudioBranchScreen = () => {
  const {
    studio: { name, slug, branches },
    refetch,
  } = useMyStudio();

  const currentBranches = branches.map(branch => {
    const { id, __typename, ...fields } = branch;
    return { ...fields };
  });

  const [newBranches, setNewBranches] = useState([...currentBranches]);

  const [updateStudioBranches, { loading }] = useMutation(
    UPDATE_STUDIO_BRANCHES,
    {
      onCompleted: async data => {
        if (data.updateBranches.ok) {
          await refetch();
          refresh();
        } else alert(ERROR_MESSAGE);
      },
      onError: () => alert(ERROR_MESSAGE),
    }
  );

  const saveData = () => {
    const ok = window.confirm(CONFIRM_INFO_UPDATE('스튜디오 지점'));
    if (!ok) return;
    updateStudioBranches({
      variables: {
        slug,
        payload: newBranches,
      },
    });
  };

  const refresh = useRefresh();

  return (
    <div className="Dashboard">
      <div className="partnersMainPartContainer">
        <div className="partnersMainPart">
          <PageTitle title="스튜디오 지점 관리" />
          <Branch
            newBranches={newBranches}
            setNewBranches={setNewBranches}
            studioName={name}
          />
          <NoticeMent />
          <InfoChangeButton
            refresh={refresh}
            onClick={saveData}
            isActive={!loading}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default StudioBranchScreen;
