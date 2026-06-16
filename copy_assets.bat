@echo off
echo ======================================================
echo Copying generated AI visual assets to assets\images...
echo ======================================================

set "SRC=C:\Users\Varsh\.gemini\antigravity\brain\9b437b3b-4343-40ef-b05d-4e7424315c5c"
set "DEST=C:\Users\Varsh\.gemini\antigravity\scratch\ragavarshini-portfolio\assets\images"

if not exist "%DEST%" mkdir "%DEST%"

copy "%SRC%\profile_placeholder_*.png" "%DEST%\profile_placeholder.png" >nul
copy "%SRC%\math_solver_mockup_*.png" "%DEST%\math_solver_mockup.png" >nul
copy "%SRC%\swarm_driving_mockup_*.png" "%DEST%\swarm_driving_mockup.png" >nul
copy "%SRC%\negotiation_agent_mockup_*.png" "%DEST%\negotiation_agent_mockup.png" >nul
copy "%SRC%\robotics_lab_visual_*.png" "%DEST%\robotics_lab_visual.png" >nul
copy "%SRC%\book_cover_placeholder_*.png" "%DEST%\book_cover_placeholder.png" >nul

echo Done! All visual assets have been successfully copied to assets\images\ folder.
pause
