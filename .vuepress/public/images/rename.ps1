# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
$i = 1
(GCI) |% { 
    Rename-Item $_ -newName "$($i)$($_.Extension)"
    $i++ 
    }