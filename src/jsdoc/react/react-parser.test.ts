/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, describe, it, beforeAll } from "vitest";
import fs from "fs-extra";
import * as path from "path";

import { parse } from "./react-parser";
import type { Doclet } from "../types";

const fixtures = path.join(__dirname, "../../..", "fixtures", "jsdoc");

function parseFile(filePath: string) {
  return parse(fs.readFileSync(filePath).toString(), "my-file.js");
}

describe("React docs Parser", () => {
  describe("parse()", () => {
    describe("Invalid code", () => {
      it("should returns an empty array", async () => {
        const doclets = await parse("this is an invalid code", "some-file");
        expect(doclets).to.be.undefined;
      });
    });

    describe("React Docs", () => {
      let doclet: Doclet;
      beforeAll(async () => {
        const file = path.join(fixtures, "react/react-docs.js");
        const doclets = await parseFile(file);
        doclet = doclets![0];
      });
      it("should have properties parsed", () => {
        expect(doclet).to.have.property("properties");
        expect(doclet.properties).to.be.an("array").with.lengthOf(3);
      });
      it("should have methods parsed", () => {
        expect(doclet).to.have.property("methods");
        expect(doclet.methods).to.be.an("array").with.lengthOf(2);
      });
      it("should parse the description correctly", () => {
        expect(doclet)
          .to.have.property("description")
          .that.is.equal("Styled button component for the rich and famous!");
      });
      it("should parse the examples correctly", () => {
        expect(doclet).to.have.property("examples").that.is.an("array").with.lengthOf(1);
      });
      it("should preserve the spaces in the example", () => {
        const example = doclet.examples[0].raw;
        expect(example).to.string("  text");
      });
      it("should parse the properties description correctly", () => {
        expect(doclet).to.have.property("properties").that.is.an("array");
        expect(doclet.properties[0].description).to.equal("Button text.");
      });
    });
    describe("elevation", () => {
      let doclet: Doclet;
      beforeAll(async () => {
        const file = path.join(fixtures, "react/elevation.tsx");
        const doclets = await parseFile(file);
        doclet = doclets![0];
        expect(doclet).to.be.an("object");
      });
      it("should have properties parsed", () => {
        expect(doclet).to.have.property("properties");
        expect(doclet.properties).to.be.an("array").with.lengthOf(1);
      });
      it("should parse the description correctly", () => {
        expect(doclet)
          .to.have.property("description")
          .that.is.equal(
            "A wrapper resembling a physical card, grouping elements and improve readability.",
          );
      });
      it("should parse the properties type correctly", () => {
        expect(doclet).to.have.property("properties").that.is.an("array");
        expect(doclet.properties[0].type).to.equal("'none' | 'low' | 'medium' | 'high'");
      });
    });
    describe("Button Component", () => {
      let doclet: Doclet;
      beforeAll(async () => {
        const file = path.join(fixtures, "react/button.tsx");
        const doclets = await parseFile(file);
        doclet = doclets![0];
        expect(doclet).to.be.an("object");
      });
      it("should have properties parsed", () => {
        expect(doclet).to.have.property("properties");
        expect(doclet.properties).to.be.an("array").with.lengthOf(7);
      });
      it("should parse the description correctly", () => {
        expect(doclet)
          .to.have.property("description")
          .that.is.equal("Styled button component for the rich and famous!");
      });
      it("should parse the properties type correctly", () => {
        expect(doclet).to.have.property("properties").that.is.an("array");
        expect(doclet.properties[2].type).to.equal('"none" | "low" | "medium" | "high"');
      });
    });
  });
});
