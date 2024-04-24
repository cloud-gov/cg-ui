import { UsersTableSpace } from './UsersTableSpace';
import { CFUSerSpace } from './_interfaces';

const maxSpaces: number = 4;

export function BottomRow({ spaces }: { spaces: Array<CFUSerSpace> }) {
  return (
    <div>
      <div className="display-flex flex-row flex-wrap padding-x-2">
        {spaces.slice(maxSpaces, spaces.length).map((space) => (
          <UsersTableSpace space={space} key={space.spaceName} />
        ))}
      </div>
    </div>
  );
}

export function UsersTableSpaces({
  spaces,
  expanded,
  setExpanded,
}: {
  spaces: Array<CFUSerSpace>;
  expanded: Boolean;
  setExpanded: Function;
}) {
  return (
    <div>
      <div className="display-flex flex-row padding-x-2">
        {spaces.slice(0, maxSpaces).map((space) => (
          <UsersTableSpace space={space} key={space.spaceName} />
        ))}
        {spaces.length > maxSpaces && (
          <button
            className="usa-button usa-button--unstyled users-table-spaces-btn"
            onClick={() => setExpanded(!expanded)}
          >
            +&nbsp;{spaces.length - 4}
            {expanded ? (
              <svg
                className="usa-icon"
                aria-hidden="true"
                role="img"
                width="20"
                height="20"
              >
                <use xlinkHref="/img/uswds/sprite.svg#expand_more"></use>
              </svg>
            ) : (
              <svg
                className="usa-icon"
                aria-hidden="true"
                role="img"
                width="20"
                height="20"
              >
                <use xlinkHref="/img/uswds/sprite.svg#expand_less"></use>
              </svg>
            )}
          </button>
        )}
      </div>
      {expanded && <BottomRow spaces={spaces} />}
    </div>
  );
}
