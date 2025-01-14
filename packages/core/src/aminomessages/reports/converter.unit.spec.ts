import {
  MsgAddReason,
  MsgCreateReport,
  MsgDeleteReport,
  MsgRemoveReason,
  MsgSupportStandardReason,
} from "@desmoslabs/desmjs-types/desmos/reports/v1/msgs";
import Long from "long";
import { ConverterTestData, runConverterTest } from "../testutils";
import {
  postTargetToAny,
  createReportsConverters,
  userTargetToAny,
} from "./converter";
import {
  MsgAddReasonTypeUrl,
  MsgCreateReportTypeUrl,
  MsgDeleteReportTypeUrl,
  MsgRemoveReasonTypeUrl,
  MsgSupportStandardReasonTypeUrl,
} from "../../const";

describe("Reports converter", () => {
  const converters = createReportsConverters();

  function executeTests(data: ConverterTestData<any>[]) {
    data.forEach((test) => {
      it(test.name, runConverterTest(converters, test));
    });
  }

  describe("MsgCreateReport", () => {
    const testData: ConverterTestData<MsgCreateReport>[] = [
      {
        name: "empty post target message",
        typeUrl: MsgCreateReportTypeUrl,
        msg: MsgCreateReport.fromPartial({
          target: postTargetToAny({
            postId: Long.fromNumber(0),
          }),
        }),
        expectedJsonSerialized:
          '{"target":{"type":"desmos/PostTarget","value":{}}}',
      },
      {
        name: "empty user target message",
        typeUrl: MsgCreateReportTypeUrl,
        msg: MsgCreateReport.fromPartial({
          target: userTargetToAny({
            user: "",
          }),
        }),
        expectedJsonSerialized:
          '{"target":{"type":"desmos/UserTarget","value":{}}}',
      },
      {
        name: "post target",
        typeUrl: MsgCreateReportTypeUrl,
        msg: {
          subspaceId: Long.fromNumber(1),
          reasonsIds: [1],
          message: "This post is spam",
          target: postTargetToAny({
            postId: Long.fromNumber(1),
          }),
          reporter: "cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47",
        },
        expectedJsonSerialized:
          '{"message":"This post is spam","reasons_ids":[1],"reporter":"cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47","subspace_id":"1","target":{"type":"desmos/PostTarget","value":{"post_id":"1"}}}',
      },
    ];
    executeTests(testData);
  });

  describe("MsgDeleteReport", () => {
    const testData: ConverterTestData<MsgDeleteReport>[] = [
      {
        name: "empty message",
        typeUrl: MsgDeleteReportTypeUrl,
        msg: MsgDeleteReport.fromPartial({}),
        expectedJsonSerialized: "{}",
      },
      {
        name: "complete message",
        typeUrl: MsgDeleteReportTypeUrl,
        msg: {
          subspaceId: Long.fromNumber(1),
          reportId: Long.fromNumber(1),
          signer: "cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47",
        },
        expectedJsonSerialized:
          '{"report_id":"1","signer":"cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47","subspace_id":"1"}',
      },
    ];
    executeTests(testData);
  });

  describe("MsgSupportStandardReason", () => {
    const testData: ConverterTestData<MsgSupportStandardReason>[] = [
      {
        name: "empty message",
        typeUrl: MsgSupportStandardReasonTypeUrl,
        msg: MsgSupportStandardReason.fromPartial({}),
        expectedJsonSerialized: "{}",
      },
      {
        name: "complete message",
        typeUrl: MsgSupportStandardReasonTypeUrl,
        msg: {
          subspaceId: Long.fromNumber(1),
          standardReasonId: 1,
          signer: "cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47",
        },
        expectedJsonSerialized:
          '{"signer":"cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47","standard_reason_id":1,"subspace_id":"1"}',
      },
    ];
    executeTests(testData);
  });

  describe("MsgAddReason", () => {
    const testData: ConverterTestData<MsgAddReason>[] = [
      {
        name: "empty message",
        typeUrl: MsgAddReasonTypeUrl,
        msg: MsgAddReason.fromPartial({}),
        expectedJsonSerialized: "{}",
      },
      {
        name: "complete message",
        typeUrl: MsgAddReasonTypeUrl,
        msg: {
          subspaceId: Long.fromNumber(1),
          title: "Spam",
          description: "This post is spam or the user is a spammer",
          signer: "cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47",
        },
        expectedJsonSerialized:
          '{"description":"This post is spam or the user is a spammer","signer":"cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47","subspace_id":"1","title":"Spam"}',
      },
    ];
    executeTests(testData);
  });

  describe("MsgRemoveReason", () => {
    const testData: ConverterTestData<MsgRemoveReason>[] = [
      {
        name: "empty message",
        typeUrl: MsgRemoveReasonTypeUrl,
        msg: MsgRemoveReason.fromPartial({}),
        expectedJsonSerialized: "{}",
      },
      {
        name: "complete message",
        typeUrl: MsgRemoveReasonTypeUrl,
        msg: {
          subspaceId: Long.fromNumber(1),
          reasonId: 1,
          signer: "cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47",
        },
        expectedJsonSerialized:
          '{"reason_id":1,"signer":"cosmos1y54exmx84cqtasvjnskf9f63djuuj68p7hqf47","subspace_id":"1"}',
      },
    ];
    executeTests(testData);
  });
});
