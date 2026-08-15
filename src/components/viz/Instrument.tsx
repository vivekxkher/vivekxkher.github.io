"use client";

import type { ReactNode, RefObject } from "react";
import styles from "./Instrument.module.css";

interface InstrumentProps {
  figure: string;
  /** Short instruction, e.g. "Drag to move the sun". */
  hint?: string;
  /** The accessible description of what the visualisation shows. */
  caption: string;
  controls?: ReactNode;
  /** Overlay drawn above the stage — readouts, annotations. */
  overlay?: ReactNode;
  /** Pointer drag drives the visualisation, so cancel native touch panning. */
  draggable?: boolean;
  stageRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

/**
 * The shared chrome for every discipline visualisation: a labelled stage, an
 * optional control strip, and the written equivalent underneath. Keeping the
 * caption inside the component is what guarantees no visualisation ships
 * without its text alternative.
 */
export function Instrument({
  figure,
  hint,
  caption,
  controls,
  overlay,
  draggable = false,
  stageRef,
  children,
}: InstrumentProps) {
  return (
    <figure className={styles.instrument} data-reveal>
      <div className={styles.head}>
        <span className="label">{figure}</span>
        {hint ? <span className={`label ${styles.hint}`}>{hint}</span> : null}
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        data-drag={draggable || undefined}
      >
        {children}
        {overlay ? <div className={styles.overlay}>{overlay}</div> : null}
      </div>

      {controls ? <div className={styles.controls}>{controls}</div> : null}

      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

interface ControlProps {
  id: string;
  label: string;
  /** Formatted current value, shown to sighted users. */
  display: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** Spoken value, e.g. "34 degrees Celsius". Falls back to `display`. */
  valueText?: string;
}

export function Control({
  id,
  label,
  display,
  min,
  max,
  step,
  value,
  onChange,
  valueText,
}: ControlProps) {
  return (
    <div className={styles.control}>
      <div className={styles.controlHead}>
        <label className="label" htmlFor={id}>
          {label}
        </label>
        <span className={styles.controlValue} aria-hidden="true">
          {display}
        </span>
      </div>
      <input
        id={id}
        className={styles.slider}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={valueText ?? display}
      />
    </div>
  );
}

interface ToggleGroupProps {
  label: string;
  options: { id: string; label: string }[];
  active: string[];
  onToggle: (id: string) => void;
}

export function ToggleGroup({
  label,
  options,
  active,
  onToggle,
}: ToggleGroupProps) {
  return (
    <div className={styles.control}>
      <div className={styles.controlHead}>
        <span className="label" id={`${label}-label`}>
          {label}
        </span>
      </div>
      <div className={styles.toggles} role="group" aria-labelledby={`${label}-label`}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.toggle}
            aria-pressed={active.includes(option.id)}
            onClick={() => onToggle(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
