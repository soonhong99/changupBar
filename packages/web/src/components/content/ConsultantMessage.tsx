// src/components/content/ConsultantMessage.tsx

const Emphasize = ({ children }: { children: React.ReactNode }) => (
    <strong className="text-blue-600 dark:text-blue-400 font-semibold">
      '{children}'
    </strong>
  );

  const BlueText = ({ children }: { children: React.ReactNode }) => (
    <strong className="text-blue-600 dark:text-blue-400 font-semibold">
      {children}
    </strong>
  );

  const RedText = ({ children }: { children: React.ReactNode }) => (
    <span className="text-red-500 font-semibold">{children}</span>
  );
  
  export default function ConsultantMessage() {
    return (
      <div className="space-y-3 text-base">
        <p>안녕하세요! 스마트창업 권순홍 컨설턴트입니다.</p>
        <p>어쩌다 스마트창업까지 오시게 되셨을까요?</p>
        <p>역시 목적은 <Emphasize>돈</Emphasize>이겠죠?</p>
        <p>목돈을 가지고 어떻게 하면 더 많이 불릴 수 있을까, 혹은 좀 편하게 벌 수 있을까, 혹은 새로운 도전을 할 수 있을까와 같은 <Emphasize>고민</Emphasize>을 저보다 깊게하신 분이라 확신합니다.</p>
        <p>그렇다면 아직까지 왜 고민하고 계실까요?</p>
        <p><Emphasize>너무 소중한 돈</Emphasize>이기 때문에.</p>
        <p><Emphasize>내 피와 땀을 갈아서 만들어낸 돈</Emphasize>이기 때문에.</p>
        <p><Emphasize>내 청춘을 녹여낸 돈</Emphasize>이기 때문에.</p>
        <p>믿고 맡기기 어렵습니다.</p>
        <p>그렇다면 수많은 사장님들께서는 <Emphasize>왜</Emphasize> 스마트창업을 선택하실까요?</p>
        <p>바로 자기 자신의 돈을 대하는 <Emphasize>태도</Emphasize>를 보았기 때문입니다.</p>
        <p>저는 항상 만나뵙는 사장님들이 <Emphasize>존경</Emphasize>스럽습니다.</p>
        <p>과연 나라면 이렇게 큰 도전을 할 수 있을까?</p>
        <p>더 나은 미래를 위해 나의 인생이 담긴 모든 것을 투자할 수 있을까?</p>
        <p>한 사람의 인생이 <Emphasize>찰나의 결정</Emphasize>으로 바뀌는구나 생각이 들었습니다.</p>
        <p>저도 가진 것이 없고, 제 꿈을 향해 나아가는 일개 소시민에 불과합니다.</p>
        <p><RedText>그럼에도 불구하고</RedText> 한번 뿐인 인생, <Emphasize>성공의 표본</Emphasize>이 되고 싶지 않으신가요?</p>
        <p>혹은, <Emphasize>안정적인 삶</Emphasize>을 꾸려 경제적 자유를 누리고 싶지 않으신가요?</p>
        <p>혹은, 1분 1초 젊을 때 <Emphasize>도전</Emphasize>하고 싶지 않으신가요?</p>
        <p>저는 이런 엄청난 도전을 하고 계신 분들께 <Emphasize>발판</Emphasize>이 되어드리겠습니다.</p>
        <p>꿈, 소망, 버킷리스트 무엇이든지간에요.</p>
        <p>스마트창업은 인연이 있는 모든 분들과 <Emphasize>함께</Emphasize> 나아가겠습니다.</p>
        <p>수년 이상 <Emphasize>지속</Emphasize>할 수 있는 <Emphasize>현실적인</Emphasize> 맞춤형 사업을 소개해드리고, 이후 미래 방향성까지 함께 고민하겠습니다.</p>
        <p>뿐만 아니라 <Emphasize>스마트모임</Emphasize>을 만들어 부동산, 주식, 창업, 사업, 마케팅 등 정통한 전문가를 모시고 좋은 자리를 공유하겠습니다.</p>
        <p>한번의 창업으로 끝나는 인연이 아닌 5년, 10년을 뛰어넘어선 <Emphasize>인생 동반자</Emphasize>가 되어주세요.</p>
        <p>여기까지 읽어주신 것 만으로도 감사드립니다.</p>
        <p>다시 한번 스마트창업에 방문해주신 모든 분들께 존경을 표하며, 많은 동기부여를 받고 가셨으면 좋겠습니다.</p>
        <p>저는 <Emphasize>고민이 끝난</Emphasize> 여러분들의 문의를 기다리고 있겠습니다.</p>
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 text-right">
          <p className="font-semibold"><BlueText>함께 나아가는 스마트창업</BlueText></p>
          <p>권순홍 올림</p>
        </div>
      </div>
    );
  }