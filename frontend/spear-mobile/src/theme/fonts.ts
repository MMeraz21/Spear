import * as Font from 'expo-font';

export const loadFonts = async () => {
  return Font.loadAsync({
    'NimbusSansL': require('../theme/fonts/NimbusSanL-Reg.otf'),
    'NimbusSansL-Bold': require('../theme/fonts/NimbusSanL-Bol.otf'),
  });
};