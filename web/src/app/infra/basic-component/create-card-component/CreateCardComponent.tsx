import styles from './createCartComponent.module.css';

export default function CreateCardComponent({
  plusSize,
  onClick,
}: {
  plusSize: number;
  onClick: () => void;
}) {
  return (
    <div
      className={`${styles.cardContainer} ${styles.createCardContainer} `}
      // 使用 100% 的原因是可以通过 flex-grow 来撑开，只要保证父元素的盒子模型的长宽就可以了
      style={{
        width: `100%`,
        height: `100%`,
        fontSize: `${plusSize}px`,
      }}
      onClick={onClick}
    >
      +
    </div>
  );
}
