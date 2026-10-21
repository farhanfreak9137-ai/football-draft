Add-Type -AssemblyName System.Drawing

function Draw-FlatLogo($g, [float]$x, [float]$y, [float]$size) {
    $state = $g.Save()
    $g.TranslateTransform($x, $y)
    $g.ScaleTransform($size / 100.0, $size / 100.0)

    # Brushes & Pens
    $colorDark = [System.Drawing.ColorTranslator]::FromHtml("#0d1117")
    $colorGreen = [System.Drawing.ColorTranslator]::FromHtml("#143820")
    $colorPitch = [System.Drawing.ColorTranslator]::FromHtml("#2ecc71")
    $colorGold = [System.Drawing.ColorTranslator]::FromHtml("#f3cf55")
    
    $brushDark = New-Object System.Drawing.SolidBrush($colorDark)
    $brushGreen = New-Object System.Drawing.SolidBrush($colorGreen)
    $brushLine = New-Object System.Drawing.SolidBrush($colorPitch)
    $brushGold = New-Object System.Drawing.SolidBrush($colorGold)

    $penGreen = New-Object System.Drawing.Pen($colorPitch, 3.0)
    $penGreen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $penPitchLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 46, 204, 113), 1.8)

    $penWhite = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 2.2)
    $penWhite.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $penWhite.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penWhite.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    # Outer Shield
    $shieldPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $shieldPath.StartFigure()
    $shieldPath.AddBezier(50, 6, 72, 6, 86, 16, 86, 32)
    $shieldPath.AddBezier(86, 32, 86, 60, 68, 76, 50, 92)
    $shieldPath.AddBezier(50, 92, 32, 76, 14, 60, 14, 32)
    $shieldPath.AddBezier(14, 32, 14, 16, 28, 6, 50, 6)
    $shieldPath.CloseFigure()

    # Inner Shield
    $innerPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $innerPath.StartFigure()
    $innerPath.AddBezier(50, 13, 67, 13, 79, 21, 79, 33)
    $innerPath.AddBezier(79, 33, 79, 56, 64, 69, 50, 83)
    $innerPath.AddBezier(50, 83, 36, 69, 21, 56, 21, 33)
    $innerPath.AddBezier(21, 33, 21, 21, 33, 13, 50, 13)
    $innerPath.CloseFigure()

    $g.FillPath($brushDark, $shieldPath)
    $g.FillPath($brushGreen, $innerPath)
    $g.DrawPath($penGreen, $shieldPath)

    # Pitch Lines
    $g.DrawLine($penPitchLine, 26, 49, 74, 49)
    $g.DrawEllipse($penPitchLine, 35, 34, 30, 30)
    $g.FillEllipse($brushLine, 47.5, 46.5, 5.0, 5.0)

    # Football Pentagon
    $pts = @(
        [System.Drawing.PointF]::new(50, 38),
        [System.Drawing.PointF]::new(59, 45),
        [System.Drawing.PointF]::new(56, 56),
        [System.Drawing.PointF]::new(44, 56),
        [System.Drawing.PointF]::new(41, 45)
    )
    $g.FillPolygon($brushDark, $pts)
    $g.DrawPolygon($penWhite, $pts)

    # Spokes
    $g.DrawLine($penWhite, 50, 38, 50, 29)
    $g.DrawLine($penWhite, 59, 45, 67, 42)
    $g.DrawLine($penWhite, 56, 56, 63, 64)
    $g.DrawLine($penWhite, 44, 56, 37, 64)
    $g.DrawLine($penWhite, 41, 45, 33, 42)

    # Champion Star
    $starPts = @(
        [System.Drawing.PointF]::new(50.0, 17.0),
        [System.Drawing.PointF]::new(52.2, 22.2),
        [System.Drawing.PointF]::new(57.8, 22.6),
        [System.Drawing.PointF]::new(53.6, 26.2),
        [System.Drawing.PointF]::new(55.0, 31.6),
        [System.Drawing.PointF]::new(50.0, 28.8),
        [System.Drawing.PointF]::new(45.0, 31.6),
        [System.Drawing.PointF]::new(46.4, 26.2),
        [System.Drawing.PointF]::new(42.2, 22.6),
        [System.Drawing.PointF]::new(47.8, 22.2)
    )
    $g.FillPolygon($brushGold, $starPts)

    $g.Restore($state)
}

# 1. Update Android Mipmaps
$mipmapConfigs = @(
    @{ folder="mipmap-mdpi"; launcher=48; foreground=108 },
    @{ folder="mipmap-hdpi"; launcher=72; foreground=162 },
    @{ folder="mipmap-xhdpi"; launcher=96; foreground=216 },
    @{ folder="mipmap-xxhdpi"; launcher=144; foreground=324 },
    @{ folder="mipmap-xxxhdpi"; launcher=192; foreground=432 }
)

$resDir = "android/app/src/main/res"

foreach ($cfg in $mipmapConfigs) {
    $dir = Join-Path $resDir $cfg.folder
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }

    # A. ic_launcher.png (Legacy Square)
    $sz = $cfg.launcher
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    Draw-FlatLogo $g 0 0 $sz
    $bmp.Save((Join-Path $dir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()

    # B. ic_launcher_round.png (Legacy Round)
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    $circlePath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $circlePath.AddEllipse(1, 1, ($sz - 2), ($sz - 2))
    $g.SetClip($circlePath)
    $brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#0d1117"))
    $g.FillEllipse($brushDark, 0, 0, $sz, $sz)
    Draw-FlatLogo $g ($sz * 0.08) ($sz * 0.08) ($sz * 0.84)
    $bmp.Save((Join-Path $dir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()

    # C. ic_launcher_foreground.png (Adaptive Foreground layer)
    # Total width is 108dp, inner safe zone is ~72dp (approx 66% scale, centered)
    $fSz = $cfg.foreground
    $bmp = New-Object System.Drawing.Bitmap($fSz, $fSz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    $contentSz = $fSz * 0.68
    $offset = ($fSz - $contentSz) / 2.0
    Draw-FlatLogo $g $offset $offset $contentSz
    $bmp.Save((Join-Path $dir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Host "Generated mipmaps for $($cfg.folder)"
}

# 2. Update Splash Screens
$splashConfigs = @(
    @{ path="drawable/splash.png"; w=480; h=320 },
    @{ path="drawable-land-mdpi/splash.png"; w=480; h=320 },
    @{ path="drawable-land-hdpi/splash.png"; w=800; h=480 },
    @{ path="drawable-land-xhdpi/splash.png"; w=1280; h=720 },
    @{ path="drawable-land-xxhdpi/splash.png"; w=1600; h=960 },
    @{ path="drawable-land-xxxhdpi/splash.png"; w=1920; h=1280 },
    @{ path="drawable-port-mdpi/splash.png"; w=320; h=480 },
    @{ path="drawable-port-hdpi/splash.png"; w=480; h=800 },
    @{ path="drawable-port-xhdpi/splash.png"; w=720; h=1280 },
    @{ path="drawable-port-xxhdpi/splash.png"; w=960; h=1600 },
    @{ path="drawable-port-xxxhdpi/splash.png"; w=1280; h=1920 }
)

$fontFamily = New-Object System.Drawing.FontFamily("Arial")
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f0fdf4"))
$brushGreenAccent = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#2ecc71"))
$colorDark = [System.Drawing.ColorTranslator]::FromHtml("#0d1117")

foreach ($s in $splashConfigs) {
    $fullPath = Join-Path $resDir $s.path
    $parent = Split-Path $fullPath
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force }

    $bmp = New-Object System.Drawing.Bitmap($s.w, $s.h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear($colorDark)

    # Size logo proportional to min dimension
    $minDim = [Math]::Min($s.w, $s.h)
    $logoSz = [Math]::Max(64, $minDim * 0.28)
    $logoX = ($s.w - $logoSz) / 2.0
    $logoY = ($s.h - $logoSz) / 2.0 - ($logoSz * 0.2)
    Draw-FlatLogo $g $logoX $logoY $logoSz

    # Subtle Title
    $fontSize = [Math]::Max(10, $logoSz * 0.12)
    $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold)
    $title = "HISTORICAL FOOTBALL SIMULATOR"
    $titleSz = $g.MeasureString($title, $font)
    $titleX = ($s.w - $titleSz.Width) / 2.0
    $titleY = $logoY + $logoSz + ($fontSize * 0.8)
    $g.DrawString($title, $font, $brushWhite, $titleX, $titleY)

    # Subtle Subtitle
    $subFontSize = [Math]::Max(8, $fontSize * 0.65)
    $subFont = New-Object System.Drawing.Font($fontFamily, $subFontSize, [System.Drawing.FontStyle]::Regular)
    $subTitle = "TACTICAL MATCH SIMULATION"
    $subTitleSz = $g.MeasureString($subTitle, $subFont)
    $subX = ($s.w - $subTitleSz.Width) / 2.0
    $subY = $titleY + $titleSz.Height + 4
    $g.DrawString($subTitle, $subFont, $brushGreenAccent, $subX, $subY)

    $bmp.Save($fullPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $font.Dispose(); $subFont.Dispose(); $g.Dispose(); $bmp.Dispose()
    Write-Host "Generated splash for $($s.path)"
}

Write-Host "ALL ASSETS GENERATED SUCCESSFULLY!"
