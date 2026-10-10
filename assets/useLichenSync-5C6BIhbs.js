import{a as o,P as c,r as a}from"./index-CSBXqkb1.js";import{s as i}from"./ShoppingListLichenSync-BNUNPGFy.js";const l=()=>{const{user:t}=o(),{settings:n}=c(),s=t?.id,e=n.lichen_enabled;return a.useCallback(async()=>{if(!(!s||!e))try{await i(s)}catch(r){console.error("Failed to sync the shopping list to Lichen",r)}},[s,e])};export{l as u};
//# sourceMappingURL=useLichenSync-5C6BIhbs.js.map
