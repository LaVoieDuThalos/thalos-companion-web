import { type ReactNode } from 'react';

import './SectionList.scss';

export type SectionListItem<T> = { title: string; data: T[] };

type Props<T> = {
  sections: SectionListItem<T>[];
  keyExtractor: (item: T) => string;
  renderSectionHeader: (section: SectionListItem<T>) => ReactNode;
  ListEmptyComponent?: ReactNode;
  renderItem: (item: T, index: number) => ReactNode;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
};

export default function SectionList<T>({
  sections,
  keyExtractor,
  renderSectionHeader,
  renderItem,
  ListHeaderComponent,
  ListFooterComponent,
}: Props<T>) {
  return (
    <div className="section-list">
      {ListHeaderComponent ? ListHeaderComponent : null}
      {sections.length > 0 &&
        sections.map((section) => (
          <div key={section.title}>
            <div>{renderSectionHeader(section)}</div>
            <div>
              {section.data.map((it, index) => (
                <div key={keyExtractor(it)} className="section-item">
                  {renderItem(it, index)}
                </div>
              ))}
            </div>
          </div>
        ))}
      {ListFooterComponent ? ListFooterComponent : null}
    </div>
  );
}
