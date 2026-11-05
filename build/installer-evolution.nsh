; Dedicated NSIS hooks for OpenBot Evolution.
; This installer intentionally does not touch OpenBot's registry keys, protocol, install location, or user data.

!macro customInstall
  WriteRegStr SHCTX "Software\Classes\openbot-evolution" "" "URL:OpenBot Evolution"
  WriteRegStr SHCTX "Software\Classes\openbot-evolution" "URL Protocol" ""
  WriteRegStr SHCTX "Software\Classes\openbot-evolution\DefaultIcon" "" "$appExe,0"
  WriteRegStr SHCTX "Software\Classes\openbot-evolution\shell\open\command" "" '"$appExe" "%1"'
!macroend

!macro customUnInstall
  ${ifNot} ${isUpdated}
    Push $0
    ReadRegStr $0 SHCTX "Software\Classes\openbot-evolution\shell\open\command" ""
    ${if} $0 == '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
      DeleteRegKey SHCTX "Software\Classes\openbot-evolution"
    ${endIf}
    Pop $0
  ${endIf}
!macroend

!macro customInstallMode
  StrCpy $isForceCurrentInstall "1"
!macroend
