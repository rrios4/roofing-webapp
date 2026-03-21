import { useState, useCallback, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

setOptions({ key: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY as string });

export interface AddressParts {
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface AddressPrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

// Singleton — library loaded once for the lifetime of the page
let placesLib: google.maps.PlacesLibrary | null = null;

async function getPlacesLib() {
  if (!placesLib) {
    placesLib = (await importLibrary('places')) as google.maps.PlacesLibrary;
  }
  return placesLib;
}

export function useAddressAutocomplete() {
  const [predictions, setPredictions] = useState<AddressPrediction[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  // Store raw PlacePrediction objects so we can call toPlace() on selection
  const rawRef = useRef<Map<string, google.maps.places.PlacePrediction>>(new Map());

  const fetchPredictions = useCallback((input: string) => {
    clearTimeout(debounceRef.current);
    if (!input || input.length < 3) {
      setPredictions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const lib = await getPlacesLib();
        const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          includedRegionCodes: ['us'],
          includedPrimaryTypes: ['street_address']
        });

        rawRef.current.clear();
        setPredictions(
          suggestions.flatMap((s) => {
            const pp = s.placePrediction;
            if (!pp) return [];
            rawRef.current.set(pp.placeId, pp);
            return [
              {
                placeId: pp.placeId,
                description: pp.text.text,
                mainText: pp.mainText?.text ?? pp.text.text,
                secondaryText: pp.secondaryText?.text ?? ''
              }
            ];
          })
        );
      } catch {
        setPredictions([]);
      }
    }, 300);
  }, []);

  const fetchPlaceDetails = useCallback(async (placeId: string): Promise<AddressParts | null> => {
    const raw = rawRef.current.get(placeId);
    if (!raw) return null;

    setDetailsLoading(true);
    try {
      const place = raw.toPlace();
      await place.fetchFields({ fields: ['addressComponents'] });

      const components = place.addressComponents ?? [];
      const get = (type: string, short = false): string => {
        const c = components.find((comp) => comp.types.includes(type));
        return c ? (short ? (c.shortText ?? '') : (c.longText ?? '')) : '';
      };

      setDetailsLoading(false);
      return {
        street_address: [get('street_number'), get('route')].filter(Boolean).join(' '),
        city: get('locality') || get('sublocality') || get('postal_town'),
        state: get('administrative_area_level_1', true),
        zipcode: get('postal_code')
      };
    } catch {
      setDetailsLoading(false);
      return null;
    }
  }, []);

  const clearPredictions = useCallback(() => setPredictions([]), []);

  return { predictions, detailsLoading, fetchPredictions, fetchPlaceDetails, clearPredictions };
}
