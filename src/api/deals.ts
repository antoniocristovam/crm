import type { StageId } from '@/types/models';

/**
 * Atualiza a etapa (stage) de um negócio no pipeline.
 *
 * Mock local para desenvolvimento — troque o corpo desta função pela chamada
 * real ao backend do CRM ao integrar:
 *
 *   export async function updateDealStage(dealId: string, stageId: StageId) {
 *     const response = await fetch(`${API_BASE_URL}/deals/${dealId}/stage`, {
 *       method: 'PATCH',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         Authorization: `Bearer ${token}`,
 *       },
 *       body: JSON.stringify({ stageId }),
 *     });
 *     if (!response.ok) throw new Error(`Falha ao atualizar etapa (${response.status})`);
 *   }
 *
 * `PipelineScreen` já trata o estado local de forma otimista e faz rollback
 * automático caso esta função rejeite a Promise.
 */
export async function updateDealStage(dealId: string, stageId: StageId): Promise<void> {
  if (__DEV__) {
    console.debug(`[mock api] PATCH /deals/${dealId}/stage -> ${stageId}`);
  }

  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      // Simulação de instabilidade de rede só para exercitar o caminho de
      // rollback nesta demo — remover assim que a chamada real for plugada.
      const shouldSimulateFailure = Math.random() < 0.12;
      if (shouldSimulateFailure) {
        reject(new Error('network_error'));
      } else {
        resolve();
      }
    }, 380);
  });
}
