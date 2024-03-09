import React, { useState } from 'react';
import useMyStudio from '../../hooks/useMyStudio';
import useRefresh from '../../hooks/useRefresh';
import PageTitle from '../../components/PageTitle';
import GeneralSaveButton from '../../components/ProductGeneral/GeneralSaveButton';
import GeneralProduct from '../../components/ProductGeneral/GeneralProduct';
import NoticeMent from '../../components/NoticeMent';
import Footer from '../../components/Footer';
import { useMutation } from '@apollo/client';
import UPDATE_STUDIO_INFO from '../../graphql/mutations/updateStudioInfo';
import { ERROR_MESSAGE } from '../../constants/errorMessages';
import { CONFIRM_INFO_UPDATE } from '../../constants/messages';

const ProductGeneralScreen = () => {
  const {
    studio: {
      slug,
      info: { weekdayPriceTag, weekendPriceTag },
    },
    refetch,
  } = useMyStudio();

  // 상품 일반 정보 불러오기
  const [newWeekdayPriceTag, setNewWeekdayPriceTag] = useState(weekdayPriceTag);
  const [newWeekendPriceTag, setNewWeekendPriceTag] = useState(weekendPriceTag);

  const refresh = useRefresh();

  const [updateStudioInfo, { loading }] = useMutation(UPDATE_STUDIO_INFO, {
    onCompleted: async data => {
      if (data.updateStudioInfo.ok) {
        await refetch();
        refresh();
      } else alert(ERROR_MESSAGE);
    },
    onError: () => alert(ERROR_MESSAGE),
  });

  const saveData = () => {
    const ok = window.confirm(CONFIRM_INFO_UPDATE());
    if (!ok) return;

    const payload = {
      weekdayPriceTag: newWeekdayPriceTag,
      weekendPriceTag: newWeekendPriceTag,
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
            <PageTitle title="상품 관리 - 일반" />
            <GeneralProduct
              weekdayTag={newWeekdayPriceTag}
              setWeekdayTag={setNewWeekdayPriceTag}
              weekendTag={newWeekendPriceTag}
              setWeekendTag={setNewWeekendPriceTag}
            />
            <NoticeMent />
            <GeneralSaveButton
              refresh={refresh}
              save={saveData}
              isActive={!loading}
            />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGeneralScreen;
