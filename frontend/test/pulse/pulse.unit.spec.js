import React from "react";
import { shallow } from "enzyme";

import RecipientPicker from "metabase/pulse/components/RecipientPicker";
import TokenField from "metabase/components/TokenField";

import { canSendTestEmail } from "metabase/lib/pulse";

// We have to do some mocking here to avoid calls to GA and to Metabase settings
jest.mock("metabase/lib/settings", () => ({
  get: () => "v",
}));

global.ga = jest.fn();

const TEST_USERS = [
  { id: 1, common_name: "Barb", email: "barb_holland@hawkins.mail" }, // w
  { id: 2, common_name: "Dustin", email: "dustin_henderson@hawkinsav.club" }, // w
  { id: 3, common_name: "El", email: "011@energy.gov" },
  { id: 4, common_name: "Lucas", email: "lucas.sinclair@hawkins.mail" }, // w
  { id: 5, common_name: "Mike", email: "dm_mike@hawkins.mail" }, // w
  { id: 6, common_name: "Nancy", email: "" },
  { id: 7, common_name: "Steve", email: "" },
  { id: 8, common_name: "Will", email: "zombieboy@upside.down" }, // w
];

describe("recipient picker", () => {
  describe("focus", () => {
    it("should be focused if there are no recipients", () => {
      const wrapper = shallow(
        <RecipientPicker
          recipients={[]}
          users={TEST_USERS}
          isNewPulse={true}
          onRecipientsChange={() => alert("why?")}
        />,
      );

      expect(
        wrapper
          .find(TokenField)
          .dive()
          .state().isFocused,
      ).toBe(true);
    });
    it("should not be focused if there are existing recipients", () => {
      const wrapper = shallow(
        <RecipientPicker
          recipients={[TEST_USERS[0]]}
          users={TEST_USERS}
          isNewPulse={true}
          onRecipientsChange={() => alert("why?")}
        />,
      );

      expect(
        wrapper
          .find(TokenField)
          .dive()
          .state().isFocused,
      ).toBe(false);
    });
  });
});

const EMAIL_PULSE = {};

describe("pulse utils", () => {
  describe("canSendTestEmail", () => {
    it("should return true if the pulse is valid, email is set up and there are recipients", () => {
      const pulse = {
        name: "Test",
        cards: [{ name: "Test card" }],
        channels: [
          {
            enabled: true,
            channel_type: "email",
            recipients: [{ name: "Kyle", email: "kyle@metabase.com" }],
          },
        ],
      };
      expect(canSendTestEmail(pulse)).toBe(true);
    });
  });
});
