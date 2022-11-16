import React, { Component, FunctionComponent } from "react";
import PropTypes from "prop-types";

class Message extends Component {
  render(): React.ReactNode {
    return <div>message</div>;
  }
}

export type ButtonProps = {
  /**
   * @description {propTypes.string} text - Button text.
   */
  text: string;
  buttonColor?: string;
  elevation?: "none" | "low" | "medium" | "high";
  optionalUnion?: string | number;
  optionalArrayOf?: number[];
  optionalObjectWithShape?: {
    optionalProperty?: string | null;
    requiredProperty: number;
  };
  optionalMessage?: Message;
};

/**
 * @name Button
 * 
 * @description Styled button component for the rich and famous!
 *
 * @example
 * <Button
 *   text="Example button text"
 *   buttonColor="red"
 *   buttonHoverColor="green"
 * />
 * 
 * @render ReactElement
 */
export const Button: FunctionComponent<ButtonProps> = ({
  text,
}: ButtonProps) => {
  return <div>{text}</div>;
};

Button.propTypes = {
  /**
   * @property {propTypes.string} text - Button text.
   */
  text: PropTypes.string.isRequired,
  /**
   * @property {propTypes.string} buttonColor- Button default background color.
   */
  buttonColor: PropTypes.string,
  elevation: PropTypes.oneOf(["none", "low", "medium", "high"]),
  optionalUnion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number.isRequired),
  optionalObjectWithShape: PropTypes.shape({
    optionalProperty: PropTypes.string,
    requiredProperty: PropTypes.number.isRequired,
  }),
  optionalMessage: PropTypes.instanceOf(Message),
};

Button.defaultProps = {
  text: "Example Button",
  buttonColor: "blue",
}