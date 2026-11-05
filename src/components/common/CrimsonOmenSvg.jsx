import React from 'react';
import { ZeusDefs, ZeusEmblem, ZeusBolt } from './ZeusSvg';

/**
 * Backward compatibility alias:
 * Re-exports ZeusDefs and ZeusEmblem as CrimsonOmenDefs and CrimsonOmen.
 * Ensures existing callers immediately render the Olympian Zeus logo without breaking.
 */
export { ZeusDefs, ZeusEmblem, ZeusBolt };

export function CrimsonOmenDefs() {
  return <ZeusDefs />;
}

export function CrimsonOmen({ className = 'w-8 h-8' }) {
  return <ZeusEmblem className={className} />;
}

export default CrimsonOmen;
