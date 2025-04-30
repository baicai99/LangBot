'use client';

import { useState, useEffect } from 'react';
import { LLMCardVO } from '@/app/home/models/component/llm-card/LLMCardVO';
import styles from './LLMConfig.module.css';
import EmptyAndCreateComponent from '@/app/home/components/empty-and-create-component/EmptyAndCreateComponent';
import { Modal } from 'antd';
import LLMCard from '@/app/home/models/component/llm-card/LLMCard';
import LLMForm from '@/app/home/models/component/llm-form/LLMForm';
import CreateCardComponent from '@/app/infra/basic-component/create-card-component/CreateCardComponent';
import { httpClient } from '@/app/infra/http/HttpClient';
import { LLMModel } from '@/app/infra/api/api-types';

export default function LLMConfigPage() {
  const [cardList, setCardList] = useState<LLMCardVO[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditForm, setIsEditForm] = useState(false);
  const [nowSelectedLLM, setNowSelectedLLM] = useState<LLMCardVO | null>(null);

  useEffect(() => {
    getLLMModelList();
  }, []);

  function getLLMModelList() {
    httpClient
      .getProviderLLMModels()
      .then((resp) => {
        const llmModelList: LLMCardVO[] = resp.models.map((model: LLMModel) => {
          console.log('model', model);
          return new LLMCardVO({
            id: model.uuid,
            name: model.name,
            company: model.requester,
            URL: model.requester_config?.base_url,
          });
        });
        console.log('get llmModelList', llmModelList);
        setCardList(llmModelList);
      })
      .catch((err) => {
        // TODO error toast
        console.error('get LLM model list error', err);
      });
  }

  function selectLLM(cardVO: LLMCardVO) {
    setIsEditForm(true);
    setNowSelectedLLM(cardVO);
    console.log('set now vo', cardVO);
    setModalOpen(true);
  }
  function handleCreateModelClick() {
    setIsEditForm(false);
    setNowSelectedLLM(null);
    setModalOpen(true);
  }

  return (
    <div className={styles.configPageContainer}>
      <Modal
        title={isEditForm ? '预览模型' : '创建模型'}
        centered
        open={modalOpen}
        destroyOnClose={true}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        width={700}
        footer={null}
      >
        <LLMForm
          editMode={isEditForm}
          initLLMId={nowSelectedLLM?.id}
          onFormSubmit={() => {
            setModalOpen(false);
            getLLMModelList();
          }}
          onFormCancel={() => {
            setModalOpen(false);
          }}
          onLLMDeleted={() => {
            setModalOpen(false);
            getLLMModelList();
          }}
        />
      </Modal>
      {cardList.length > 0 && (
        <div className={`${styles.modelListContainer}`}>
          {cardList.map((cardVO) => {
            return (
              <div
                key={cardVO.id}
                onClick={() => {
                  selectLLM(cardVO);
                }}
                style={{ height: '100%', width: '100%' }}
              >
                {/* 使用 100% 撑开，使用 grid 就可以改变所有卡片的宽高 */}
                <LLMCard cardVO={cardVO}></LLMCard>
              </div>
            );
          })}
          <CreateCardComponent plusSize={90} onClick={handleCreateModelClick} />
          {/* 删除原有卡片的宽高属性，设定为 100% */}
        </div>
      )}

      {cardList.length === 0 && (
        <div className={`${styles.emptyContainer}`}>
          <EmptyAndCreateComponent
            title={'模型列表空空如也～'}
            subTitle={'快去创建一个吧！'}
            buttonText={'创建模型 +'}
            onButtonClick={() => {
              handleCreateModelClick();
            }}
          />
        </div>
      )}
    </div>
  );
}
