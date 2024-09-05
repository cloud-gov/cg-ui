import { OrgPickerListItem } from './OrgPickerListItem';

export function OrgPickerList() {
  return (
    <ul
      className="orgs-selector__list usa-list usa-list--unstyled maxh-card overflow-x-hidden overflow-y-scroll border-bottom border-top border-base-light"
      tabIndex={0}
      aria-label="Organizations list"
    >
      <OrgPickerListItem>another-organization-name-goes-here</OrgPickerListItem>
      <OrgPickerListItem>significantly-shorter-name</OrgPickerListItem>
      <OrgPickerListItem>another-organization-name-goes-here</OrgPickerListItem>
      <OrgPickerListItem>
        what-happens-when-an-organization-name-is-really-long
      </OrgPickerListItem>
      <OrgPickerListItem>significantly-shorter-name</OrgPickerListItem>
      <OrgPickerListItem>another-shorter-name</OrgPickerListItem>
      <OrgPickerListItem>
        hey-that-is-a-really-long-name-for-an-organization
      </OrgPickerListItem>
    </ul>
  );
}
