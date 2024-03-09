import React, { useState } from 'react';
import './StudioInfoScreen.css';
import PageTitle from '../components/PageTitle';
import StudioGeneralInfo from '../components/Info/StudioGeneralInfo';
import Cover from '../components/Info/Cover';
import InfoChangeButton from '../components/Info/InfoChangeButton';
import Footer from '../components/Footer';
import NoticeMent from '../components/NoticeMent';
import useMyStudio from '../hooks/useMyStudio';
import useRefresh from '../hooks/useRefresh';
import StudioAdditionalInfo from '../components/Info/StudioAdditionalInfo';
import { CONFIRM_INFO_UPDATE } from '../constants/messages';
import { useMutation } from '@apollo/client';
import UPDATE_STUDIO_INFO from '../graphql/mutations/updateStudioInfo';
import { ERROR_MESSAGE } from '../constants/errorMessages';

const StudioInfoScreen = () => {
  const {
    studio: {
      name,
      slug,
      logoUrl,
      coverPhotoUrl,
      info: { contactUrl, reservationUrl, description, reservation, cancel },
    },
    refetch,
  } = useMyStudio();

  const refresh = useRefresh();

  const [contactLink, setContactLink] = useState(contactUrl);
  const [reservationLink, setReservationLink] = useState(reservationUrl);
  const [newDescription, setNewDescription] = useState(description);
  const [newReservation, setNewReservation] = useState(reservation);
  const [newCancel, setNewCancel] = useState(cancel);

  const [updateStudioInfo, { loading }] = useMutation(UPDATE_STUDIO_INFO, {
    onCompleted: async data => {
      if (data.updateStudioInfo.ok) {
        await refetch();
        refresh();
      } else alert(ERROR_MESSAGE);
    },
    onError: () => alert(ERROR_MESSAGE),
  });

  //적용하기 눌렀을 때 저장하기
  const saveData = () => {
    const ok = window.confirm(CONFIRM_INFO_UPDATE());
    if (!ok) return;

    const payload = {
      contactUrl: contactLink,
      reservationUrl: reservationLink,
      description: newDescription,
      reservation: newReservation,
      cancel: newCancel,
    };

    updateStudioInfo({
      variables: {
        slug,
        payload,
      },
    });
  };

  return (
    <div>
      <div className="Dashboard">
        <div className="partnersMainPartContainer">
          <div className="partnersMainPart">
            <PageTitle title="스튜디오 정보 관리" />
            <Cover
              refetch={refetch}
              currentLogoUrl={logoUrl}
              currentCoverUrl={coverPhotoUrl}
            />
            <StudioGeneralInfo
              studioName={name}
              currentContactLink={contactUrl}
              contactLink={contactLink}
              setContactLink={setContactLink}
              currentReservationLink={reservationUrl}
              reservationLink={reservationLink}
              setReservationLink={setReservationLink}
            />
            <StudioAdditionalInfo
              description={newDescription}
              setDescription={setNewDescription}
              reservation={newReservation}
              setReservation={setNewReservation}
              cancel={newCancel}
              setCancel={setNewCancel}
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
    </div>
  );
};

export default StudioInfoScreen;
