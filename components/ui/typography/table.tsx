type Value = { id: string } & Record<string, React.ReactNode>

export const TypographyTable = ({ keys, values }: { keys: string[]; values: Value[] }) => {
  return (
    <div className="w-full overflow-y-auto">
      <table className="w-full">
        {/* <thead>
          <tr className="even:bg-muted m-0 border-t p-0">
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              King&apos;s Treasury
            </th>
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              People&apos;s happiness
            </th>
          </tr>
        </thead> */}
        <tbody>
          {values.map(value => (
            <tr
              key={value.id}
              className="even:bg-muted m-0 border-t p-0"
            >
              {keys.map(key => (
                <td
                  key={key}
                  className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right"
                >
                  {value[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
